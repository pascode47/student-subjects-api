const request = require('supertest');
const app = require('../src/app');

describe('Student API', () => {
    it('should return a list of students', async () => {
        const response = await request(app).get('/students');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('students');
        expect(response.body.students.length).toBeGreaterThanOrEqual(10);
    });

    it('should return students with name and enrolled program', async () => {
        const response = await request(app).get('/students');
        const students = response.body.students;
        students.forEach(student => {
            expect(student).toHaveProperty('name');
            expect(student).toHaveProperty('enrolledProgram');
        });
    });
});