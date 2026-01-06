import { ValidatorFn, ValidatorMiddleware } from '../../mod.ts';
import { type Context, type Next, Router } from '../deps.ts';

const router = new Router();

const { body, check } = ValidatorMiddleware.createMiddleware<Context, Next>();
const { isArray, isIn, isObject, isString, contains, matches, hasLength, hasAllowedCharacters } = ValidatorFn.createValidator();

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
  body(
    check('account.name').exists(),
    check('account.phone').isOptional()
  ),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body6',
  body(check('colors.*.name').ifValue(hasLength({ min: 3 }))),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body7',
  body(
    check('color.list.*.name').ifValue(hasLength({ min: 3 })),
    check('color.list.*.hex').maybe().ifValue(hasLength({ min: 6 }))
  ),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body8',
  body(check('user').ifValue(isObject())),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body9',
  body(
    check('login').maybe().ifValue(contains('NS')),
    check('code').maybe().ifValue(contains('test', true)),
  ),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body10',
  body(check('phone').ifValue(matches(/^\d{3}-\d{3}-\d{4}$/))),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body11',
  body(check('cities').ifValue(isIn(['New York', 'Los Angeles', 'Chicago']))),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body12',
  body(check('feature').ifValue(isString())),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

router.post(
  '/validate-body13',
  body(check('feature').ifValue(hasAllowedCharacters('a-zA-Z0-9_'))),
  ({ response, state }: Context) => {
    response.status = 200;
    response.body = state.request_body;
  },
);

export default router;
