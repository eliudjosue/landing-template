import { NextRequest, NextResponse } from 'next/server';
import { verifyBasicAuth, requireAuth } from '@/lib/auth';
import { getLeads } from '@/lib/leads-storage';

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  if (!verifyBasicAuth(authorization)) {
    return requireAuth();
  }

  try {
    const leads = getLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}