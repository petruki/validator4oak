import { ValidatorFn, ValidatorMiddleware } from '../../mod.ts';
import { Context, Router } from '../deps.ts';

const router = new Router();

const { query } = ValidatorMiddleware.createMiddleware();
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
    { key: 'name' },
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query2',
  query([
    { key: 'name', validators: [hasLenght({ min: 2, max: 5 })] },
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query3',
  query([
    { key: 'url', validators: [isUrl()] },
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query4',
  query([
    { key: 'number', validators: [isNumeric()] },
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query5',
  query([
    { key: 'boolean', validators: [isBoolean()] },
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

router.get(
  '/validate-query6',
  query([
    { key: 'url', validators: [isUrl(), isUrlDomainDotCom] },
  ]),
  ({ response }: Context) => {
    response.status = 200;
    response.body = {};
  },
);

export default router;
