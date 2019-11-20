import testAppContainer from '../../../test.index';
import App from '../../../_core/_base/app';
import supertest = require('supertest');

let appContainer: App;
let request: supertest.SuperTest<supertest.Test>;
beforeEach(async () => {
  appContainer = await testAppContainer;
  request = supertest(appContainer.app);
});

test('Testing upload file', async () => {
  const response = await request
    .post('/uploader/upload')
    .set('Content-Type', 'multipart/form-data')
    .attach('', `${__dirname}/test.files/test.png`)
    .expect(201);
  expect(response.body).not.toBeNull();
});
