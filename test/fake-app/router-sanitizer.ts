import { ValidatorMiddleware, ValidatorSn } from '../../mod.ts';
import { Context, Router } from '../deps.ts';

const router = new Router();

const { query, body } = ValidatorMiddleware.createMiddleware();
const { escape, lowerCase, upperCase, trim } = ValidatorSn.createSanitizer();

router.get(
  '/sanitize-query1',
  query([
    { key: 'name', sanitizer: [escape()] },
  ]),
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
  query([
    { key: 'name', sanitizer: [lowerCase()] },
  ]),
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
  query([
    { key: 'name', sanitizer: [upperCase()] },
  ]),
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
  query([
    { key: 'name', sanitizer: [trim()] },
  ]),
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
  body([
    { key: 'name', sanitizer: [escape()] },
  ]),
  ({ response, state }: Context) => {
    const name = state.request_body.name;
    response.status = 200;
    response.body = {
      name,
    };
  },
);

export default router;
