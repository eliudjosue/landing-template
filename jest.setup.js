// Mock environment variables for testing
process.env.RATE_LIMIT_WINDOW = '60';
process.env.RATE_LIMIT_MAX = '20';

// Mock crypto.randomUUID for Node.js environments that don't have it
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(2) + Date.now().toString(36)
  };
}