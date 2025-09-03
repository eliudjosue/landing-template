import { POST } from '../../src/app/api/leads/route';
import { z } from 'zod';

// Mock NextRequest
class MockNextRequest {
  constructor(body, options = {}) {
    this.body = body;
    this.ip = options.ip || '127.0.0.1';
    this.headers = new Map([
      ['user-agent', options.userAgent || 'test-agent'],
      ...Object.entries(options.headers || {})
    ]);
  }

  async json() {
    return this.body;
  }

  get(name) {
    return this.headers.get(name);
  }
}

// Mock file system for testing
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => '[]'),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
}));

describe('/api/leads', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should accept valid lead data', async () => {
    const validData = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: 'Estoy interesado en sus servicios de desarrollo web.',
    };

    const request = new MockNextRequest(validData);
    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.message).toBe('Mensaje enviado correctamente');
  });

  test('should reject invalid email', async () => {
    const invalidData = {
      name: 'Juan Pérez',
      email: 'email-invalido',
      message: 'Mensaje de prueba válido.',
    };

    const request = new MockNextRequest(invalidData);
    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.error).toBe('Datos inválidos');
    expect(responseData.details).toContain('Email inválido');
  });

  test('should reject short name', async () => {
    const invalidData = {
      name: 'A',
      email: 'juan@example.com',
      message: 'Mensaje de prueba válido.',
    };

    const request = new MockNextRequest(invalidData);
    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.error).toBe('Datos inválidos');
  });

  test('should reject short message', async () => {
    const invalidData = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      message: 'Corto',
    };

    const request = new MockNextRequest(invalidData);
    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.error).toBe('Datos inválidos');
  });

  test('should handle honeypot (bot detection)', async () => {
    const botData = {
      name: 'Bot Name',
      email: 'bot@example.com',
      message: 'Bot message with sufficient length.',
      honeypot: 'bot-filled-value', // Bots suelen llenar todos los campos
    };

    const request = new MockNextRequest(botData);
    const response = await POST(request);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.message).toBe('Mensaje enviado correctamente');
    // El bot no debería generar un error, pero el lead no se debería guardar realmente
  });
});