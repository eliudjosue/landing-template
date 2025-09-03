import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveLead } from '@/lib/leads-storage';
import { rateLimiter } from '@/lib/rate-limit';

const LeadSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  honeypot: z.string().optional(),
});

// GET endpoint for healthcheck
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: 'Use POST to submit leads.' 
  });
}

// POST endpoint for submitting leads
export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.ip || 
               request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const rateLimitResult = rateLimiter.check(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = LeadSchema.parse(body);

    // Honeypot check - if filled, it's likely a bot
    if (validatedData.honeypot && validatedData.honeypot.trim() !== '') {
      // Return success to not reveal the honeypot to bots
      return NextResponse.json({ 
        success: true, 
        message: 'Gracias por tu mensaje' 
      });
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Save lead
    const lead = await saveLead({
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      ip,
      userAgent,
    });

    // Send to n8n webhook if configured
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lead),
        });
      } catch (webhookError) {
        console.error('Error sending to webhook:', webhookError);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensaje enviado correctamente' 
      },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        }
      }
    );

  } catch (error) {
    console.error('Error processing lead:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.errors[0].message,
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}