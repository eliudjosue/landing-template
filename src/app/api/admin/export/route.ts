import { NextRequest, NextResponse } from 'next/server';
import { verifyBasicAuth, requireAuth } from '@/lib/auth';
import { getLeads, generateCSV } from '@/lib/leads-storage';

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  if (!verifyBasicAuth(authorization)) {
    return requireAuth();
  }

  try {
    const leads = getLeads();
    const csv = generateCSV(leads);
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}