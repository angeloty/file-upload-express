import testAppContainer from '../../../test.index';
import App from '../../../_core/_base/app';
import supertest = require('supertest');

let appContainer: App;
let request: supertest.SuperTest<supertest.Test>;
beforeEach(async () => {
  appContainer = await testAppContainer;
  request = supertest(appContainer.app);
});

const testModel: { id?: string; name: string; description: string } = {
  name: 'Testing',
  description: 'Test description'
};

test('Testing insert test', async () => {
  const response = await request
    .post('/test/test')
    .set('Content-Type', 'application/json')
    .send(testModel)
    .expect(201);
  expect(response.body.name).toBe(testModel.name);
  expect(response.body.description).toBe(testModel.description);
  testModel.id = response.body.id;
});

test('Testing get test', async () => {
  const response = await request
    .get('/test/test/' + testModel.id)
    .send()
    .expect(200);
  expect(response.body.name).toBe(testModel.name);
  expect(response.body.description).toBe(testModel.description);
});

test('Testing update test', async () => {
  const newModel = testModel;
  newModel.name = 'Test Updated';
  newModel.description = 'Test description updated';
  const response = await request
    .put('/test/test/' + testModel.id)
    .send(newModel)
    .expect(200);
  expect(response.body.name).toBe(newModel.name);
  expect(response.body.description).toBe(newModel.description);
});

test('Testing get all tests', async () => {
  const response = await request
    .get('/test/test')
    .send()
    .expect(200);
});

test('Testing delete test', async () => {
  await request
    .delete('/test/test/' + testModel.id)
    .send()
    .expect(204);
  await request
    .put('/test/test/' + testModel.id)
    .send()
    .expect(404);
});
