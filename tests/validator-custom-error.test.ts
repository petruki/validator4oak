import app from './fake-app/app.ts';
import { assertEquals, superoak } from './deps.ts';

Deno.test({
  name: 'it should FAIL when validating a param - custom error',
  async fn() {
    const request = await superoak(app);
    const response = await request.get('/validate-custom-error1').send().expect(400);

    assertEquals(response.body, {
      code: 400,
      message: 'Invalid name input. Cause: it is required.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a param - custom error',
  async fn() {
    const request = await superoak(app);
    const response = await request.get('/validate-custom-error1?name=John').send().expect(200);

    assertEquals(response.body, {});
  },
});
