import ValidatorBuilder from './validator-builder.ts';
import type { ErrorHandler, IContext, INext, ValidatorHeaderParams, ValidatorParams } from './validator-types.ts';

/**
 * Middleware to validate the request parameters
 */
export class ValidatorMiddleware<T, Y> extends ValidatorBuilder {
  /**
   * Create a new instance of the validator middleware
   */
  static createMiddleware<T, Y>(): ValidatorMiddleware<T, Y> {
    const validator = new ValidatorMiddleware();
    validator.useErrorHandler = validator.useErrorHandler.bind(validator);
    validator.query = validator.query.bind(validator);
    validator.body = validator.body.bind(validator);
    validator.form = validator.form.bind(validator);
    validator.header = validator.header.bind(validator);
    validator.check = validator.check.bind(validator);
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

  query(args: ValidatorParams[]): (context: T, next: Y) => Promise<unknown>;
  query(args: ValidatorParams): (context: T, next: Y) => Promise<unknown>;

  /**
   * Check the query parameters
   *
   * @param args validator parameters
   * @returns middleware
   */
  query(args: ValidatorParams[] | ValidatorParams): (context: T, next: Y) => Promise<unknown> {
    return async (context: T, next: Y) => {
      const icontext = context as IContext;
      const inext = next as INext;

      for (const arg of args instanceof Array ? args : [args]) {
        const value = icontext.request.url.searchParams.get(arg.key) || '';

        if (!this.queryHandler(arg, value, context)) {
          return;
        }
      }

      return await inext();
    };
  }

  body(args: ValidatorParams[]): (context: T, next: Y) => Promise<unknown>;
  body(args: ValidatorParams): (context: T, next: Y) => Promise<unknown>;

  /**
   * Check the request body
   *
   * @param args validator parameters
   * @returns middleware
   */
  body(args: ValidatorParams[] | ValidatorParams): (context: T, next: Y) => Promise<unknown> {
    return async (context: T, next: Y) => {
      const icontext = context as IContext;
      const inext = next as INext;

      const body = await icontext.request.body.text();

      if (!body) {
        return this.errorHandler(context, 'Invalid request body');
      }

      icontext.state.request_body = JSON.parse(body);
      return this.iterateValidators(args, icontext, context, inext);
    };
  }

  form(args: ValidatorParams[]): (context: T, next: Y) => Promise<unknown>;
  form(args: ValidatorParams): (context: T, next: Y) => Promise<unknown>;

  /**
   * Check the request form data
   *
   * @param args validator parameters
   * @returns middleware
   */
  form(args: ValidatorParams[] | ValidatorParams): (context: T, next: Y) => Promise<unknown> {
    return async (context: T, next: Y) => {
      const icontext = context as IContext;
      const inext = next as INext;

      const formData = await icontext.request.body.formData();
      const entries = Object.fromEntries(formData);

      if (!Object.keys(entries).length) {
        return this.errorHandler(context, 'Invalid form data');
      }

      icontext.state.request_body = entries;
      return this.iterateValidators(args, icontext, context, inext);
    };
  }

  header(args: ValidatorHeaderParams[]): (context: T, next: Y) => Promise<unknown>;
  header(args: ValidatorHeaderParams): (context: T, next: Y) => Promise<unknown>;

  /**
   * Check the request header
   *
   * @param args validator parameters
   * @returns middleware
   */
  header(args: ValidatorHeaderParams[] | ValidatorHeaderParams): (context: T, next: Y) => Promise<unknown> {
    return async (context: T, next: Y) => {
      const icontext = context as IContext;
      const inext = next as INext;

      for (const arg of args instanceof Array ? args : [args]) {
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

  private async iterateValidators(
    args: ValidatorHeaderParams[] | ValidatorHeaderParams,
    icontext: IContext,
    context: T,
    inext: INext,
  ) {
    for (const arg of args instanceof Array ? args : [args]) {
      const values = this.getBodyValues(arg, icontext);

      for (const value of values) {
        if (!this.bodyHandler(arg, value, context)) {
          return;
        }
      }
    }

    return await inext();
  }

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
