import { ValidatorMiddleware, ValidatorSn } from '../../mod.ts';
import { type Context, Router } from '../deps.ts';

const router = new Router();

const { query, body, check } = ValidatorMiddleware.createMiddleware();
const { escape, lowerCase, upperCase, trim, replace } = ValidatorSn.createSanitizer();

router.get(
  '/sanitize-query1',
  query(check('name').sanitizeWith(escape()).exists()),
  ({ response, request }: Context) => {
    const name = request.url.searchParams.get('name');
    response.status = 200;
    response.body = {
      name,
    };
  },
);

router.get(
  '/sanitize-query2',
  query(check('name').sanitizeWith(lowerCase()).exists()),
  ({ response, request }: Context) => {
    const name = request.url.searchParams.get('name');
    response.status = 200;
    response.body = {
      name,
    };
  },
);

router.get(
  '/sanitize-query3',
  query(check('name').sanitizeWith(upperCase()).exists()),
  ({ response, request }: Context) => {
    const name = request.url.searchParams.get('name');
    response.status = 200;
    response.body = {
      name,
    };
  },
);

router.get(
  '/sanitize-query4',
  query(check('name').sanitizeWith(trim()).exists()),
  ({ response, request }: Context) => {
    const name = request.url.searchParams.get('name');
    response.status = 200;
    response.body = {
      name,
    };
  },
);

router.post(
  '/sanitize-body1',
  body(check('name').sanitizeWith(escape()).exists()),
  ({ response, state }: Context) => {
    const name = state.request_body.name;
    response.status = 200;
    response.body = {
      name,
    };
  },
);

router.post(
  '/sanitize-body2',
  body(check('name')
    .sanitizeWith(trim(), lowerCase())
    .exists()
  ),
  ({ response, state }: Context) => {
    const name = state.request_body.name;
    response.status = 200;
    response.body = {
      name,
    };
  },
);

router.post(
  '/sanitize-body3',
  body(check('name').sanitizeWith(replace(' ', '-')).exists()),
  ({ response, state }: Context) => {
    const name = state.request_body.name;
    response.status = 200;
    response.body = {
      name,
    };
  },
);

export default router;
