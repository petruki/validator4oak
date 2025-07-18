import app from './fake-app/app.ts';
import { assertEquals, superoak } from './deps.ts';

Deno.test({
  name: 'it should PASS when validating a form body',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-form1')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('name=John&phone=1234567890')
      .expect(200);

    assertEquals(response.body, { name: 'John', phone: '1234567890' });
  },
});

Deno.test({
  name: 'it should FAIL when validating a form body - missing required field',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-form1')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('phone=1234567890')
      .expect(422);

    assertEquals(response.body, {
      error: 'Invalid name input. Cause: it is required.',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a form body - phone number is not numeric',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-form1')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('name=John&phone=not-a-number')
      .expect(422);

    assertEquals(response.body, {
      error: 'Invalid phone input. Cause: it is not a valid number.',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a form - no form provided',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-form1')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send()
      .expect(422);

    assertEquals(response.body, {
      error: 'Invalid form data',
    });
  },
});