import { Context, Next } from './deps.ts';
import type { ErrorHandler, ValidatorHeaderParams, ValidatorParams } from './validator-types.ts';

export class ValidatorMiddleware {
  static createMiddleware() {
    const validator = new ValidatorMiddleware();
    validator.runValidators = validator.runValidators.bind(validator);
    validator.useErrorHandler = validator.useErrorHandler.bind(validator);
    validator.errorHandler = validator.errorHandler.bind(validator);
    validator.query = validator.query.bind(validator);
    validator.body = validator.body.bind(validator);
    validator.header = validator.header.bind(validator);
    return validator;
  }

  private errorHandler: ErrorHandler = (context: Context, error: string) => {
    context.response.status = 422;
    context.response.body = { error };
  };

  private runValidators(arg: ValidatorParams, value: string, context: Context) {
    if (!value) {
      if (arg.optional) {
        return true;
      }

      this.errorHandler(context, arg.message || `Invalid ${arg.key} input. Cause: it is required.`);
      return false;
    }

    for (const validator of arg.validators ?? []) {
      const { result, message } = validator(value, arg.key, arg.message);
      if (!result) {
        this.errorHandler(context, message);
        return false;
      }
    }

    return true;
  }

  /**
   * Override the default error handler
   *
   * @param handler function to handle the error
   */
  useErrorHandler(handler: ErrorHandler) {
    this.errorHandler = handler;
  }

  /**
   * Check the query parameters
   *
   * @param args validator parameters
   * @returns middleware
   */
  query(args: ValidatorParams[]) {
    return async (context: Context, next: Next) => {
      for (const arg of args) {
        const value = context.request.url.searchParams.get(arg.key) || '';

        if (!this.runValidators(arg, value, context)) {
          return;
        }

        if (arg.sanitizer) {
          context.request.url.searchParams.set(arg.key, arg.sanitizer.reduce((v, s) => s(v), value));
        }
      }

      return await next();
    };
  }

  /**
   * Check the request body
   *
   * @param args validator parameters
   * @returns middleware
   */
  body(args: ValidatorParams[]) {
    return async (context: Context, next: Next) => {
      const body = await context.request.body.text();

      if (!body) {
        return this.errorHandler(context, 'Invalid request body');
      }

      context.state.request_body = JSON.parse(body);
      for (const arg of args) {
        const value = arg.key.split('.').reduce((o, i) => {
          if (o) return o[i];
        }, context.state.request_body);

        if (!this.runValidators(arg, value, context)) {
          return;
        }

        if (arg.sanitizer) {
          context.state.request_body[arg.key] = arg.sanitizer.reduce((v, s) => s(v), value);
        }
      }

      return await next();
    };
  }

  /**
   * Check the request header
   *
   * @param args validator parameters
   * @returns middleware
   */
  header(args: ValidatorHeaderParams[]) {
    return async (context: Context, next: Next) => {
      for (const arg of args) {
        const value = context.request.headers.get(arg.key) || '';

        if (!this.runValidators(arg, value, context)) {
          return;
        }
      }

      return await next();
    };
  }
}
