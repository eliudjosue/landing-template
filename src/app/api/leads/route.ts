import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { saveLead } from '@/lib/leads-storage';

const leadSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000),
  honeypot: z.string().optional(), // Campo honeypot para detectar bots
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || 
              request.headers.get('x-forwarded-for')?.split(',')[0] || 
              'unknown';

    // Rate limiting
    const rateLimitResult = rateLimit(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes. Inténtalo más tarde.',
          retryAfter: rateLimitResult.reset 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate data
    const validatedData = leadSchema.parse(body);

    // Honeypot check - if honeypot field is filled, it's likely a bot
    if (validatedData.honeypot && validatedData.honeypot.trim() !== '') {
      return NextResponse.json(
        { message: 'Mensaje enviado correctamente' }, 
        { status: 200 }
      );
    }

    // Save lead
    const lead = saveLead({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      ip,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // Send to n8n webhook if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
      } catch (error) {
        console.error('Error sending to n8n webhook:', error);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente' },
      { 
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toISOString(),
        }
      }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}