import { ValidatorFn, ValidatorMiddleware, ValidatorSn } from '../../mod.ts';
import { type Context, type Next, Router } from '../deps.ts';

const router = new Router();

const { header, query, body, check } = ValidatorMiddleware.createMiddleware<Context, Next>();
const { isNumeric, isBoolean, hasLength } = ValidatorFn.createValidator();
const { trim } = ValidatorSn.createSanitizer();

router.post('/validate-all',
  header(check('x-custom-header').exists()),
  query(check('cache').ifValue(isBoolean())),
  body(
    check('name').exists(),
    check('phone')
      .sanitizeWith(trim())
      .ifValue(isNumeric(), hasLength({ min: 10, max: 15 }))
  ),
  ({ request, response, state }: Context) => {
  response.status = 200;
  response.body = {
    headers: request.headers.get('x-custom-header'),
    query: request.url.searchParams.get('cache'),
    body: state.request_body
  }
});

export default router;
