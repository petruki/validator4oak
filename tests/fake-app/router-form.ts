import { ValidatorFn, ValidatorMiddleware } from '../../mod.ts';
import { type Context, type Next, Router } from '../deps.ts';

const router = new Router();

const { form, check } = ValidatorMiddleware.createMiddleware<Context, Next>();
const { isNumeric, hasLength } = ValidatorFn.createValidator();

router.post('/validate-form1', 
  form(
    check('name').exists(),
    check('phone').ifValue(isNumeric(), hasLength({ min: 10, max: 15 }))
  ),
  ({ response, state }: Context) => {
  response.status = 200;
  response.body = state.request_body;
});

export default router;
