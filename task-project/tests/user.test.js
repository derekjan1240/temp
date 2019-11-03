const request = require('supertest');
const app = require('../src/app');

test('should signup a new user', async()=>{
    await request(app).post('/users').send({
        name:'Johnson',
        email: 'johnson@test.com',
        password:'johnson1234'
    }).expect(201);
});
