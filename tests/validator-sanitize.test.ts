import app from './fake-app/app.ts';
import { superoak } from './deps.ts';

Deno.test({
  name: 'it should sanitize the query parameters - using escape',
  async fn() {
    const request = await superoak(app);
    await request.get('/sanitize-query1?name=<script>alert("hi")</script>')
      .expect(200, { name: '&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;' });
  },
});

Deno.test({
  name: 'it should sanitize the query parameters - using lowerCase',
  async fn() {
    const request = await superoak(app);
    await request.get('/sanitize-query2?name=HelloWorld')
      .expect(200, { name: 'helloworld' });
  },
});

Deno.test({
  name: 'it should sanitize the query parameters - using upperCase',
  async fn() {
    const request = await superoak(app);
    await request.get('/sanitize-query3?name=HelloWorld')
      .expect(200, { name: 'HELLOWORLD' });
  },
});

Deno.test({
  name: 'it should sanitize the query parameters - using trim',
  async fn() {
    const request = await superoak(app);
    await request.get('/sanitize-query4?name=  HelloWorld  ')
      .expect(200, { name: 'HelloWorld' });
  },
});

Deno.test({
  name: 'it should sanitize the request body - using escape',
  async fn() {
    const request = await superoak(app);
    await request.post('/sanitize-body1').send({ name: '<script>alert("hi")</script>' })
      .expect(200, { name: '&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;' });
  },
});

Deno.test({
  name: 'it should sanitize the request body - using multiple sanitizers',
  async fn() {
    const request = await superoak(app);
    await request.post('/sanitize-body2').send({ name: '  HELLOWORLD  ' })
      .expect(200, { name: 'helloworld' });
  },
});