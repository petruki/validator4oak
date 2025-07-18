import { ValidatorFn, ValidatorMiddleware } from '../../mod.ts';
import { type Context, Router } from '../deps.ts';

const router = new Router();

const { query, check } = ValidatorMiddleware.createMiddleware();
const { hasLenght, isUrl, isNumeric, isBoolean } = ValidatorFn.createValidator();

const isUrlDomainDotCom = (value: string) => {
  return {
    result: value.endsWith('.com'),
    message: 'url must end with .com',
  };
};

router.get(
  '/validate-query1',
  query([
    check('name').exists()
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query2',
  query([
    check('name').ifValue([hasLenght({ min: 2, max: 5 })])
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query3',
  query([
    check('url').ifValue([isUrl()])
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query4',
  query([
    check('number').ifValue([isNumeric()])
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query5',
  query([
    check('boolean').ifValue([isBoolean()])
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query6',
  query([
    check('url').ifValue([isUrl(), isUrlDomainDotCom]),
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

export default router;
