/**
 * @jest-environment node
 */

import { POST, GET } from '../../src/app/api/leads/route';

// Mock the dependencies
jest.mock('../../src/lib/leads-storage', () => ({
  saveLead: jest.fn().mockResolvedValue({
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message content',
    createdAt: '2024-01-01T00:00:00.000Z',
    ip: '127.0.0.1',
    userAgent: 'test-agent'
  })
}));

jest.mock('../../src/lib/rate-limit', () => ({
  rateLimiter: {
    check: jest.fn().mockReturnValue({
      allowed: true,
      remaining: 19,
      resetTime: Date.now() + 60000
    })
  }
}));

describe('/api/leads', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    test('should return healthcheck message', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.message).toBe('Use POST to submit leads.');
    });
  });

  describe('POST', () => {
    test('should accept valid lead data', async () => {
      const validLead = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with enough characters'
      };

      const mockRequest = {
        json: () => Promise.resolve(validLead),
        ip: '127.0.0.1',
        headers: {
          get: (name) => {
            const headers = {
              'user-agent': 'test-browser/1.0'
            };
            return headers[name] || null;
          }
        }
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Mensaje enviado correctamente');
    });

    test('should reject invalid email', async () => {
      const invalidLead = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message with enough characters'
      };

      const mockRequest = {
        json: () => Promise.resolve(invalidLead),
        ip: '127.0.0.1',
        headers: {
          get: () => null
        }
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Email inválido');
    });

    test('should reject short message', async () => {
      const invalidLead = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short'
      };

      const mockRequest = {
        json: () => Promise.resolve(invalidLead),
        ip: '127.0.0.1',
        headers: {
          get: () => null
        }
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toBe('El mensaje debe tener al menos 10 caracteres');
    });

    test('should handle honeypot (bot protection)', async () => {
      const botLead = {
        name: 'Bot Name',
        email: 'bot@spam.com',
        message: 'This is a spam message from bot',
        honeypot: 'filled-by-bot'
      };

      const mockRequest = {
        json: () => Promise.resolve(botLead),
        ip: '127.0.0.1',
        headers: {
          get: () => null
        }
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      // Should return success to not reveal honeypot to bots
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Gracias por tu mensaje');
    });
  });

  describe('Rate Limiting', () => {
    test('should respect rate limits', async () => {
      // Mock rate limiter to return not allowed
      const { rateLimiter } = require('../../src/lib/rate-limit');
      rateLimiter.check.mockReturnValueOnce({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000
      });

      const validLead = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with enough characters'
      };

      const mockRequest = {
        json: () => Promise.resolve(validLead),
        ip: '127.0.0.1',
        headers: {
          get: () => null
        }
      };

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Demasiadas solicitudes. Intenta de nuevo más tarde.');
    });
  });
});