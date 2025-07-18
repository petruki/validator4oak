import { ValidatorFn, ValidatorMiddleware } from '../../mod.ts';
import { type Context, type Next, Router } from '../deps.ts';

const router = new Router();

const { body, check } = ValidatorMiddleware.createMiddleware<Context, Next>();
const { isArray, isNumeric, hasLenght } = ValidatorFn.createValidator();

router.post(
  '/validate-body1',
  body(check('name').exists()),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body2',
  body(check('account.name').exists()),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body3',
  body(check('colors').ifValue(isArray())),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body4',
  body(check('colors').ifValue(isArray({ min: 1, max: 2 }))),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body5',
  body([
    check('account.name').exists(),
    check('account.phone').isOptional()
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body6',
  body(check('colors.*.name').ifValue(hasLenght({ min: 3 }))),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body7',
  body([
    check('color.list.*.name').ifValue(hasLenght({ min: 3 })),
    check('color.list.*.hex').maybe().ifValue(hasLenght({ min: 6 }))
  ]),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post('/validate-form-body8', 
  body([
    check('name').exists(),
    check('phone').ifValue([isNumeric(), hasLenght({ min: 10, max: 15 })])
  ]),
  ({ response, state }: Context) => {
  response.status = 200;
  response.body = state.request_body;
});

export default router;
