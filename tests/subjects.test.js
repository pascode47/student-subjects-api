const request = require('supertest');
const app = require('../src/app');

describe('Subject API', () => {
    it('should return all subjects for the Software Engineering program', async () => {
        const response = await request(app).get('/subjects');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('subjects');
        expect(Array.isArray(response.body.subjects)).toBe(true);
    });
});