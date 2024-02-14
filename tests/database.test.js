const request = require('supertest');
const app = require('../src/app');

describe('Health Check API', () => {
    it('GET /healthz', async () => {
      const response = await request(app).get('/healthz');
      expect(response.status).toBe(200);
     
      
    });
  });

  