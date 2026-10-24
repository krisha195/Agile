const request = require('supertest');
const app = require('../app');

describe('Base Application and Route Handlers', () => {
  it('GET /api/health should return health status 200 with JSON', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('uptime');
  });

  it('GET / should return 200 status (serving frontend or API status)', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('GET /api/nonexistent-route should return 404', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Not found' });
  });
});
