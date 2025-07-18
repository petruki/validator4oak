import type { ValidatorFunction, ValidatorParams, ValidatorSanitizer } from './validator-types.ts';

/**
 * Base class for building validators
 */
export default class ValidatorBuilder {
  private _validator: ValidatorParams = { key: '' };

  /**
   * Initialize a new instance of the validator builder
   *
   * @param key the key to validate
   * @param message the message for the validation error
   * @returns this instance
   */
  check(key: string, message?: string): this {
    this._validator = { key, message };
    return this;
  }

  /**
   * Mark the validator as optional
   *
   * @returns this instance
   */
  maybe(): this {
    this._validator.optional = true;
    return this;
  }

  /**
   * Set the sanitizers for the validator
   *
   * @param sanitizers the sanitizers to apply
   * @returns this instance
   */
  sanitizeWith(...sanitizers: ValidatorSanitizer[]): this {
    this._validator.sanitizer = sanitizers;
    return this;
  }

  /**
   * Build the validator with the provided validators
   *
   * @param validators the validators to run
   * @returns validator parameters
   */
  ifValue(...validators: ValidatorFunction[]): ValidatorParams {
    this._validator.validators = validators;
    return this._validator;
  }

  /**
   * Build the validator with the provided message
   *
   * @param message the message for the validation error
   * @returns validator parameters
   */
  exists(message?: string): ValidatorParams {
    this._validator.message = message;
    return this._validator;
  }

  /**
   * Build the validator as optional
   *
   * @param message optional message for the validation error
   * @returns validator parameters
   */
  isOptional(message?: string): ValidatorParams {
    this._validator.optional = true;
    this._validator.message = message;
    return this._validator;
  }
}
