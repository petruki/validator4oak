import app from './fake-app/app.ts';
import { assertEquals, superoak } from './deps.ts';

Deno.test({
  name: 'it should FAIL when validating a body - no body provided',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body1').send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid request body',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - missing required field',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body1').send({
      phone: '1234567890',
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid name input. Cause: it is required.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - all fields provided',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body1').send({
      name: 'John Doe',
      phone: '1234567890',
    }).expect(200);

    assertEquals(response.body, {
      name: 'John Doe',
      phone: '1234567890',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - missing required nested field',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body2').send({
      account: {
        phone: '1234567890',
      },
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid account.name input. Cause: it is required.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - all nested fields provided',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body2').send({
      account: {
        name: 'John Doe',
        phone: '1234567890',
      },
    }).expect(200);

    assertEquals(response.body, {
      account: {
        name: 'John Doe',
        phone: '1234567890',
      },
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - missing required array field',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body3').send({
      colors: 'red',
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid colors input. Cause: it is not a valid array.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - all array fields provided',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body3').send({
      colors: ['red', 'green', 'blue'],
    }).expect(200);

    assertEquals(response.body, {
      colors: ['red', 'green', 'blue'],
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - array field is too long',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body4').send({
      colors: ['red', 'green', 'blue', 'yellow'],
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid colors input. Cause: it exceeds the maximum size of 2.',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - array field is too small',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body4').send({
      colors: [],
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid colors input. Cause: it is too small for the minimum size of 1.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - array field is within the limits',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body4').send({
      colors: ['red', 'green'],
    }).expect(200);

    assertEquals(response.body, {
      colors: ['red', 'green'],
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - optional field is missing',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body5').send({
      account: {
        name: 'John Doe',
      },
    }).expect(200);

    assertEquals(response.body, {
      account: {
        name: 'John Doe',
      },
    });
  },
});
