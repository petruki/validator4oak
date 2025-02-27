import { ValidatorMiddleware } from '../../mod.ts';
import { type Context, Router } from '../deps.ts';

const router = new Router();

const { query, useErrorHandler } = ValidatorMiddleware.createMiddleware();

useErrorHandler((context, message) => {
  context.response.status = 400;
  context.response.body = {
    code: 400,
    message,
  };
});

router.get(
  '/validate-custom-error1',
  query([
    { key: 'name' },
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

export default router;
