import type { ErrorHandler, IContext, INext, ValidatorHeaderParams, ValidatorParams } from './validator-types.ts';

/**
 * Middleware to validate the request parameters
 */
export class ValidatorMiddleware<T, Y> {
  /**
   * Create a new instance of the validator middleware for body, query, and header
   */
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

        if (!this.queryHandler(arg, value, context)) {
          return;
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
        const values = this.getBodyValues(arg, icontext);

        for (const value of values) {
          if (!this.bodyHandler(arg, value, context)) {
            return;
          }
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

  private queryHandler(arg: ValidatorParams, value: string, context: T) {
    if (!this.runValidators(arg, value, context)) {
      return;
    }

    if (arg.sanitizer) {
      (context as IContext).request.url.searchParams.set(arg.key, arg.sanitizer.reduce((v, s) => s(v), value));
    }

    return true;
  }

  private bodyHandler(arg: ValidatorParams, value: string, context: T) {
    if (!this.runValidators(arg, value, context)) {
      return;
    }

    if (arg.sanitizer) {
      (context as IContext).state.request_body[arg.key] = arg.sanitizer.reduce((v, s) => s(v), value);
    }

    return true;
  }

  private getBodyValues(arg: ValidatorParams, icontext: IContext) {
    const keys = arg.key.split('.');

    if (arg.key.includes('*')) {
      return this.getValues(icontext.state.request_body, keys);
    }

    return [
      keys.reduce((o, i) => {
        if (o) return o[i];
      }, icontext.state.request_body),
    ];
  }

  private getValues(obj: Record<string, unknown>, keys: string[]): unknown[] {
    if (!keys.length) {
      return [obj];
    }

    const key = String(keys.shift());
    if (key === '*') {
      return this.getValues(obj, keys.slice());
    }

    const value = obj[key];
    if (!value) {
      return [''];
    }

    if (Array.isArray(value)) {
      return value.flatMap((v) => this.getValues(v as Record<string, unknown>, keys.slice()));
    }

    return this.getValues(value as Record<string, unknown>, keys);
  }
}
