import app from './fake-app/app.ts';
import { assertEquals, superoak } from './deps.ts';

Deno.test({
  name: 'it should PASS when validating header, query, and body - all fields provided',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-all?cache=true')
      .set('x-custom-header', 'custom-value')
      .send({
        name: 'John Doe',
        phone: '  1234567890  '
      }).expect(200);

    assertEquals(response.body, {
      headers: 'custom-value',
      query: 'true',
      body: {
        name: 'John Doe',
        phone: '1234567890',
      }
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating header, query, and body - missing required fields',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-all?cache=true')
      .set('x-custom-header', 'custom-value')
      .send({
        phone: '1234567890'
      }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid name input. Cause: it is required.'
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating header, query, and body - invalid phone number',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-all?cache=true')
      .set('x-custom-header', 'custom-value')
      .send({
        name: 'John Doe',
        phone: '123' // Invalid phone number
      }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid phone input. Cause: it is too short for the minimum length of 10.'
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating header, query, and body - missing custom header',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-all?cache=true')
      .send({
        name: 'John Doe',
        phone: '1234567890'
      }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid x-custom-header input. Cause: it is required.'
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating header, query, and body - invalid query parameter',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-all?cache=not-a-boolean')
      .set('x-custom-header', 'custom-value')
      .send({
        name: 'John Doe',
        phone: '1234567890'
      }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid cache input. Cause: it is not a valid boolean.'
    });
  },
});