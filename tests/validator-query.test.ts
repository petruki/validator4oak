import app from './fake-app/app.ts';
import { assertEquals, superoak } from './deps.ts';

Deno.test({
  name: 'it should FAIL when validating a required param - missing name',
  async fn() {
    const request = await superoak(app);
    const response = await request.get('/validate-query1').send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid name input. Cause: it is required.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a required param - with name',
  async fn() {
    const params = new URLSearchParams();
    params.append('name', 'John');

    const request = await superoak(app);
    const response = await request.get(`/validate-query1?${params.toString()}`).send().expect(200);

    assertEquals(response.body, {});
  },
});

Deno.test({
  name: 'it should FAIL when validating non-optional param - missing name',
  async fn() {
    const request = await superoak(app);
    const response = await request.get('/validate-query2').send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid name input. Cause: it is required.',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating lenght of a param - name too long',
  async fn() {
    const params = new URLSearchParams();
    params.append('name', 'John Doe');

    const request = await superoak(app);
    const response = await request.get(`/validate-query2?${params.toString()}`).send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid name input. Cause: it exceeds the maximum length of 5.',
    });
  },
});

Deno.test({
  name: 'it should FAIL when validating lenght of a param - name too short',
  async fn() {
    const params = new URLSearchParams();
    params.append('name', 'J');

    const request = await superoak(app);
    const response = await request.get(`/validate-query2?${params.toString()}`).send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid name input. Cause: it is too short for the minimum length of 2.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating lenght of a param - name within limits',
  async fn() {
    const params = new URLSearchParams();
    params.append('name', 'John');

    const request = await superoak(app);
    const response = await request.get(`/validate-query2?${params.toString()}`).send().expect(200);

    assertEquals(response.body, {});
  },
});

Deno.test({
  name: 'it should FAIL when validating a URL param - invalid URL',
  async fn() {
    const params = new URLSearchParams();
    params.append('url', 'invalid-url');

    const request = await superoak(app);
    const response = await request.get(`/validate-query3?${params.toString()}`).send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid url input. Cause: it is not a valid URL.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a URL param - valid URL',
  async fn() {
    const params = new URLSearchParams();
    params.append('url', 'https://example.com');

    const request = await superoak(app);
    const response = await request.get(`/validate-query3?${params.toString()}`).send().expect(200);

    assertEquals(response.body, {});
  },
});

Deno.test({
  name: 'it should FAIL when validating a numeric param - invalid number',
  async fn() {
    const params = new URLSearchParams();
    params.append('number', 'invalid-number');

    const request = await superoak(app);
    const response = await request.get(`/validate-query4?${params.toString()}`).send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid number input. Cause: it is not a valid number.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a numeric param - valid number',
  async fn() {
    const params = new URLSearchParams();
    params.append('number', '123');

    const request = await superoak(app);
    const response = await request.get(`/validate-query4?${params.toString()}`).send().expect(200);

    assertEquals(response.body, {});
  },
});

Deno.test({
  name: 'it should FAIL when validating a boolean param - invalid boolean',
  async fn() {
    const params = new URLSearchParams();
    params.append('boolean', 'invalid-boolean');

    const request = await superoak(app);
    const response = await request.get(`/validate-query5?${params.toString()}`).send().expect(422);

    assertEquals(response.body, {
      error: 'Invalid boolean input. Cause: it is not a valid boolean.',
    });
  },
});

Deno.test({
  name: 'it should PASS when validating a boolean param - valid boolean',
  async fn() {
    const params = new URLSearchParams();
    params.append('boolean', 'true');

    const request = await superoak(app);
    const response = await request.get(`/validate-query5?${params.toString()}`).send().expect(200);

    assertEquals(response.body, {});
  },
});

Deno.test({
  name: 'it should FAIL when custom validating a URL param - invalid URL',
  async fn() {
    const params = new URLSearchParams();
    params.append('url', 'https://example.org');

    const request = await superoak(app);
    const response = await request.get(`/validate-query6?${params.toString()}`).send().expect(422);

    assertEquals(response.body, {
      error: 'url must end with .com',
    });
  },
});

Deno.test({
  name: 'it should PASS when custom validating a URL param - valid URL',
  async fn() {
    const params = new URLSearchParams();
    params.append('url', 'https://example.com');

    const request = await superoak(app);
    const response = await request.get(`/validate-query6?${params.toString()}`).send().expect(200);

    assertEquals(response.body, {});
  },
});
