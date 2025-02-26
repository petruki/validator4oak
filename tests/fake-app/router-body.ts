import { ValidatorFn, ValidatorMiddleware } from '../../mod.ts';
import { type Context, type Next, Router } from '../deps.ts';

const router = new Router();

const { body } = ValidatorMiddleware.createMiddleware<Context, Next>();
const { isArray, hasLenght } = ValidatorFn.createValidator();

router.post(
  '/validate-body1',
  body([
    { key: 'name' },
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body2',
  body([
    { key: 'account.name' },
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body3',
  body([
    { key: 'colors', validators: [isArray()] },
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body4',
  body([
    { key: 'colors', validators: [isArray({ min: 1, max: 2 })] },
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body5',
  body([
    { key: 'account.name' },
    { key: 'account.phone', optional: true },
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body6',
  body([
    { key: 'colors.*.name', validators: [hasLenght({ min: 3 })] }
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body7',
  body([
    { key: 'color.list.*.name', validators: [hasLenght({ min: 3 })] },
    { key: 'color.list.*.hex', optional: true, validators: [hasLenght({ min: 6 })] }
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

export default router;
