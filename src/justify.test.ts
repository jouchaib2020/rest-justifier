import request from 'supertest';
import { app } from './index';

describe('POST /api/justify', () => {
  it('should justify text with valid token', async () => {
    const tokenResponse = await request(app).post('/api/token').send({ email: 'valid@email.com' });
    const token = tokenResponse.body.token;

    const response = await request(app).post('/api/justify')
      .set('Authorization', `Bearer ${token}`)
      .send('This is some text to justify.');

    expect(response.status).toBe(200);
    expect(response.text).toMatch(/This is some text\nthat needs justification./);
  });

  it('should return 401 for unauthorized request', async () => {
    const response = await request(app).post('/api/justify').send('text');
    expect(response.status).toBe(401);
  });

  it('should return 402 for exceeding daily limit', async () => {
    const tokenResponse = await request(app).post('/api/token').send({ email: 'valid@email.com' });
    const token = tokenResponse.body.token;

    // Simulate exceeding daily limit
    for (let i = 0; i < 10000; i++) {
      await request(app).post('/api/justify')
        .set('Authorization', `Bearer ${token}`)
        .send('text');
    }

    const response = await request(app).post('/api/justify')
      .set('Authorization', `Bearer ${token}`)
      .send('text');

    expect(response.status).toBe(402);
  });
});
