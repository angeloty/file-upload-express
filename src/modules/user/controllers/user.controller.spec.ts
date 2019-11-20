import testAppContainer from '../../../test.index';
import App from '../../../_core/_base/app';
import supertest = require('supertest');

let appContainer: App;
let request: supertest.SuperTest<supertest.Test>;
beforeEach(async () => {
  appContainer = await testAppContainer;
  request = supertest(appContainer.app);
});

const userModel: {
  id?: string;
  username: string;
  password: string;
  email: string;
} = {
  username: 'user-test',
  email: 'user-test@mail',
  password: '1234567890'
};

let token: string = '';

test('Testing insert user', async () => {
  const response = await request
    .post('/users/signup')
    .set('Content-Type', 'application/json')
    .send(userModel)
    .expect(201);
  expect(response.body.username).toBe(userModel.username);
  expect(response.body.email).toBe(userModel.email);
  expect(response.body.active).toBeTruthy();
  expect(response.body.id).not.toBeNull();
  userModel.id = response.body.id;
});

test('Testing user login', async () => {
  const response = await request
    .post('/users/signin')
    .set('Content-Type', 'application/json')
    .send(userModel)
    .expect(200);
  expect(response.body.user).not.toBeNull();
  expect(response.body.token).not.toBeNull();
  expect(response.body.user.username).toBe(userModel.username);
  expect(response.body.user.email).toBe(userModel.email);
  expect(response.body.user.id).toBe(userModel.id);
  token = response.body.token;
});

test('Testing get user', async () => {
  const response = await request
    .get('/users/' + userModel.id)
    .set('Authorization', 'Bearer ' + token)
    .send()
    .expect(200);
  expect(response.body.username).toBe(userModel.username);
  expect(response.body.email).toBe(userModel.email);
  expect(response.body.id).toBe(userModel.id);
  expect(response.body.active).toBeTruthy();
});

test('Testing update user', async () => {
  const response = await request
    .put('/users/' + userModel.id)
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({
      username: 'new-test',
      email: 'new-test@email'
    })
    .expect(200);
  userModel.username = 'new-test';
  userModel.email = 'new-test@email';
  expect(response.body.username).toBe(userModel.username);
  expect(response.body.email).toBe(userModel.email);
  expect(response.body.id).toBe(userModel.id);
  expect(response.body.active).toBeTruthy();
});

test('Testing block username duplicated', async () => {
  await request
    .post('/users')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({
      username: 'new-test',
      email: 'other@email',
      password: '1234567'
    })
    .expect(400);
});

test('Testing block email duplicated', async () => {
  await request
    .post('/users')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + token)
    .send({
      username: 'other-new-test',
      email: 'new-test@email',
      password: '1234567'
    })
    .expect(400);
});

test('Testing get all users', async () => {
  await request
    .get('/users')
    .send()
    .expect(200);
});

test('Testing delete user', async () => {
  await request
    .delete('/users/' + userModel.id)
    .set('Authorization', 'Bearer ' + token)
    .send()
    .expect(204);
  await request
    .get('/users/' + userModel.id)
    .set('Authorization', 'Bearer ' + token)
    .send()
    .expect(404);
});
