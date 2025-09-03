import bcrypt from 'bcryptjs';

export function verifyBasicAuth(authorization: string | null): boolean {
  if (!authorization || !authorization.startsWith('Basic ')) {
    return false;
  }

  const credentials = Buffer.from(authorization.slice(6), 'base64').toString();
  const [username, password] = credentials.split(':');

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return false;
  }

  return username === adminUser && bcrypt.compareSync(password, bcrypt.hashSync(adminPassword, 10));
}

export function requireAuth(): Response | null {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  });
}