import { NextRequest, NextResponse } from 'next/server';

// GET endpoint to check if user is authenticated
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPassword) {
      console.error('ADMIN_USER or ADMIN_PASSWORD environment variables not set');
      return NextResponse.json({ error: 'Admin credentials not configured' }, { status: 500 });
    }

    if (username === adminUser && password === adminPassword) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
  }
}

// POST endpoint for authentication
export async function POST(request: NextRequest) {
  return GET(request);
}