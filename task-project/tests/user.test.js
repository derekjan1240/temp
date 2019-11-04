const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user-model');
const {userOneId, userOne, setupDatabase} = require('./fixtures/db');
jest.setTimeout(30000);

beforeEach(setupDatabase);

test('should signup a new user', async()=>{
    const response = await request(app).post('/users').send({
        name:'Joe',
        email: 'joe@test.com',
        password:'joe1234'
    }).expect(201);
    // Assert that the db was changed correctly
    const user = await User.findById(response.body.newUser._id);
    expect(user).not.toBeNull();

    // Assertions about the responese
    expect(response.body).toMatchObject({
        newUser: {
            name: 'Joe',
            email: 'joe@test.com'
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('mike1234');
});

test('Should login existing user', async()=>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: '0000'
    }).expect(400)
});

test('Should get profile of user', async()=>{
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should not get profile of user', async()=>{
    await request(app).get('/users/me')
        .send()
        .expect(401)
});

test('Should delete account for user', async()=>{
    const response = await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticate user', async()=>{
    await request(app).delete('/users/me')
        .send()
        .expect(401)
});

test('Should upload avatar image', async()=>{
    await request(app).post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', './task-project/tests/fixtures/1.jpg')
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async()=>{
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name:'Eric'
        })
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Eric')
});

test('Should not update invalid user fields', async()=>{
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            invaildField: 'Eric'
        })
        .expect(400)
});