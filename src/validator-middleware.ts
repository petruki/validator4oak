import type { ErrorHandler, IContext, INext, ValidatorHeaderParams, ValidatorParams } from './validator-types.ts';

/**
 * Middleware to validate the request parameters
 */
export class ValidatorMiddleware<T, Y> {
  static createMiddleware<T, Y>(): ValidatorMiddleware<T, Y> {
    const validator = new ValidatorMiddleware();
    validator.runValidators = validator.runValidators.bind(validator);
    validator.useErrorHandler = validator.useErrorHandler.bind(validator);
    validator.errorHandler = validator.errorHandler.bind(validator);
    validator.query = validator.query.bind(validator);
    validator.body = validator.body.bind(validator);
    validator.header = validator.header.bind(validator);
    return validator;
  }

  private errorHandler: ErrorHandler = (context: T, error: string) => {
    const icontext = context as IContext;
    icontext.response.status = 422;
    icontext.response.body = { error };
  };

  private runValidators(arg: ValidatorParams, value: string, context: T) {
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
  query(args: ValidatorParams[]): (context: T, next: Y) => Promise<unknown> {
    return async (context: T, next: Y) => {
      const icontext = context as IContext;
      const inext = next as INext;

      for (const arg of args) {
        const value = icontext.request.url.searchParams.get(arg.key) || '';

        if (!this.runValidators(arg, value, context)) {
          return;
        }

        if (arg.sanitizer) {
          icontext.request.url.searchParams.set(arg.key, arg.sanitizer.reduce((v, s) => s(v), value));
        }
      }

      return await inext();
    };
  }

  /**
   * Check the request body
   *
   * @param args validator parameters
   * @returns middleware
   */
  body(args: ValidatorParams[]): (context: T, next: Y) => Promise<unknown> {
    return async (context: T, next: Y) => {
      const icontext = context as IContext;
      const inext = next as INext;

      const body = await icontext.request.body.text();

      if (!body) {
        return this.errorHandler(context, 'Invalid request body');
      }

      icontext.state.request_body = JSON.parse(body);
      for (const arg of args) {
        const value = arg.key.split('.').reduce((o, i) => {
          if (o) return o[i];
        }, icontext.state.request_body);

        if (!this.runValidators(arg, value, context)) {
          return;
        }

        if (arg.sanitizer) {
          icontext.state.request_body[arg.key] = arg.sanitizer.reduce((v, s) => s(v), value);
        }
      }

      return await inext();
    };
  }

  /**
   * Check the request header
   *
   * @param args validator parameters
   * @returns middleware
   */
  header(args: ValidatorHeaderParams[]): (context: T, next: Y) => Promise<unknown> {
    return async (context: T, next: Y) => {
      const icontext = context as IContext;
      const inext = next as INext;

      for (const arg of args) {
        const value = icontext.request.headers.get(arg.key) || '';

        if (!this.runValidators(arg, value, context)) {
          return;
        }
      }

      return await inext();
    };
  }
}
