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
    const body = {
      name: 'John Doe',
      phone: '1234567890',
    };

    const request = await superoak(app);
    const response = await request.post('/validate-body1').send(body).expect(200);

    assertEquals(response.body, body);
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
    const body = {
      account: {
        name: 'John Doe',
        phone: '1234567890',
      },
    };

    const request = await superoak(app);
    const response = await request.post('/validate-body2').send(body).expect(200);

    assertEquals(response.body, body);
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
    const body = { colors: ['red', 'green', 'blue'] };

    const request = await superoak(app);
    const response = await request.post('/validate-body3').send(body).expect(200);

    assertEquals(response.body, body);
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
    const body = { colors: ['red', 'green'] };

    const request = await superoak(app);
    const response = await request.post('/validate-body4').send(body).expect(200);

    assertEquals(response.body, body);
  },
});

Deno.test({
  name: 'it should PASS when validating a body - optional field is missing',
  async fn() {
    const body = { account: { name: 'John Doe' } };

    const request = await superoak(app);
    const response = await request.post('/validate-body5').send(body).expect(200);

    assertEquals(response.body, body);
  },
});

Deno.test({
  name: 'it should PASS when validating a body - array of objects',
  async fn() {
    const body = {
      colors: [
        { name: 'red' },
        { name: 'green' },
      ],
    };

    const request = await superoak(app);
    const response = await request.post('/validate-body6').send(body).expect(200);

    assertEquals(response.body, body);
  }
});

Deno.test({
  name: 'it should FAIL when validating a body - element from array does not meet the requirements',
  async fn() {
    const body = {
      colors: [
        { name: 'r' },
        { name: 'green' },
      ],
    };

    const request = await superoak(app);
    const response = await request.post('/validate-body6').send(body).expect(422);

    assertEquals(response.body, {
      error: 'Invalid colors.*.name input. Cause: it is too short for the minimum length of 3.',
    });
  }
});

Deno.test({
  name: 'it should PASS when validating a body - array of nested objects',
  async fn() {
    const body = {
      color: {
        list: [
          { name: 'red' },
          { name: 'green', hex: '#00FF00' },
        ],
      },
    };

    const request = await superoak(app);
    const response = await request.post('/validate-body7').send(body).expect(200);

    assertEquals(response.body, body);
  }
});

Deno.test({
  name: 'it should FAIL when validating a body - array of nested objects does not meet the optional rule requirement',
  async fn() {
    const body = {
      color: {
        list: [
          { name: 'red' },
          { name: 'green', hex: '#00' },
        ],
      },
    };

    const request = await superoak(app);
    const response = await request.post('/validate-body7').send(body).expect(422);

    assertEquals(response.body, {
      error: 'Invalid color.list.*.hex input. Cause: it is too short for the minimum length of 6.',
    });
  }
});

Deno.test({
  name: 'it should PASS when validating a body - object type',
  async fn() {
    const body = {
      user: {
        name: 'John Doe',
        age: 30,
      },
    };

    const request = await superoak(app);
    const response = await request.post('/validate-body8').send(body).expect(200);

    assertEquals(response.body, body);
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - object type with missing required field',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body8').send({
      user: 'John Doe',
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid user input. Cause: it is not a valid object.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - contains string',
  async fn() {
    const body = { login: 'NS12345' };

    const request = await superoak(app);
    const response = await request.post('/validate-body9').send(body).expect(200);

    assertEquals(response.body, body);
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - contains string does not match',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body9').send({
      login: '12345',
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid login input. Cause: it does not contain "NS".',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - contains string with case sensitivity',
  async fn() {
    const body = { code: 'test123' };

    const request = await superoak(app);
    const response = await request.post('/validate-body9').send(body).expect(200);

    assertEquals(response.body, body);
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - contains string with case sensitivity does not match',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body9').send({
      code: 'TEST123',
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid code input. Cause: it does not contain "test".',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - matches pattern',
  async fn() {
    const body = { phone: '123-456-7890' };

    const request = await superoak(app);
    const response = await request.post('/validate-body10').send(body).expect(200);

    assertEquals(response.body, body);
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - matches pattern does not match',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body10').send({
      phone: '1234567890',
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid phone input. Cause: it does not match the pattern.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a body - values are in a set',
  async fn() {
    const body = { cities: ['New York', 'Los Angeles'] };

    const request = await superoak(app);
    const response = await request.post('/validate-body11').send(body).expect(200);

    assertEquals(response.body, body);
  }
});

Deno.test({
  name: 'it should PASS when validating a body - value is in a set',
  async fn() {
    const body = { cities: 'New York' };

    const request = await superoak(app);
    const response = await request.post('/validate-body11').send(body).expect(200);

    assertEquals(response.body, body);
  }
});

Deno.test({
  name: 'it should FAIL when validating a body - value are not in a set',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body11').send({
      cities: ['Miami', 'Houston'],
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid cities input. Cause: it is not in the allowed values.',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating a body - value is not in a set',
  async fn() {
    const request = await superoak(app);
    const response = await request.post('/validate-body11').send({
      cities: 'Miami',
    }).expect(422);

    assertEquals(response.body, {
      error: 'Invalid cities input. Cause: it is not in the allowed values.',
    });
  },
});