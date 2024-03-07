import app from './fake-app/app.ts';
import { superoak } from './deps.ts';

Deno.test({
  name: 'it should FAIL to validate the header - no header',
  async fn() {
    const request = await superoak(app);
    await request.get('/validate-header1').expect(422, { error: 'Invalid x-api-key input. Cause: it is required.' });
  },
});

Deno.test({
  name: 'it should PASS to validate the header',
  async fn() {
    const request = await superoak(app);
    await request.get('/validate-header1').set('x-api-key', '123').expect(200, { apiKey: '123' });
  },
});

Deno.test({
  name: 'it should FAIL to validate the header - not numeric',
  async fn() {
    const request = await superoak(app);
    await request.get('/validate-header1').set('x-api-key', 'abc').expect(422, {
      error: 'Invalid x-api-key input. Cause: it is not a valid number.',
    });
  },
});
