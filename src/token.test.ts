import request from 'supertest';
import { app } from './index';

describe('POST /api/token', () => {
  it('should return a token with valid email', async () => {
    const response = await request(app).post('/api/token').send({ email: 'valid@email.com' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return error for missing email', async () => {
    const response = await request(app).post('/api/token').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
