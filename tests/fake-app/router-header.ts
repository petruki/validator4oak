import { ValidatorFn, ValidatorMiddleware } from '../../mod.ts';
import { type Context, Router } from '../deps.ts';

const router = new Router();

const { header, check } = ValidatorMiddleware.createMiddleware();
const { isNumeric } = ValidatorFn.createValidator();

router.get(
  '/validate-header1',
  header([
    check('x-api-key').ifValue([isNumeric()])
  ]),
  ({ response, request }: Context) => {
    response.status = 200;
    response.body = {
      // This is only a test. Don't do this!!! Reflected Cross-Site Scripting (XSS)
      apiKey: request.headers.get('x-api-key'),
    };
  },
);

export default router;
