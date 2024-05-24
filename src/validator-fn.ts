import type { SizeValidation, ValidatorResponse } from './validator-types.ts';

const successResponse = { result: true, message: 'valid' };

/**
 * ValidatorFn class provides a set of methods to validate input values.
 */
export class ValidatorFn {
  /**
   * Creates a new instance of ValidatorFn.
   */
  static createValidator(): ValidatorFn {
    return new ValidatorFn();
  }

  /**
   * Check content length of a string.
   */
  hasLenght(sizeValidation: SizeValidation): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (sizeValidation.max && value.length > sizeValidation.max) {
        return {
          result: false,
          message: message || `Invalid ${key} input. Cause: it exceeds the maximum length of ${sizeValidation.max}.`,
        };
      }

      if (sizeValidation.min && value.length < sizeValidation.min) {
        return {
          result: false,
          message: message ||
            `Invalid ${key} input. Cause: it is too short for the minimum length of ${sizeValidation.min}.`,
        };
      }

      return successResponse;
    };
  }

  /**
   * Check if value is a URL.
   */
  isUrl(): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (!RegExp(/^(http|https|file):/, 'i').exec(value)) {
        return {
          result: false,
          message: message || `Invalid ${key} input. Cause: it is not a valid URL.`,
        };
      }

      return successResponse;
    };
  }

  /**
   * Check if value is a number type.
   */
  isNumeric(): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (isNaN(Number(value))) {
        return {
          result: false,
          message: message || `Invalid ${key} input. Cause: it is not a valid number.`,
        };
      }

      return successResponse;
    };
  }

  /**
   * Check if value is a boolean type.
   */
  isBoolean(): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (value !== 'true' && value !== 'false') {
        return {
          result: false,
          message: message || `Invalid ${key} input. Cause: it is not a valid boolean.`,
        };
      }

      return successResponse;
    };
  }

  /**
   * Check if value is an array type.
   */
  isArray(sizeValidation?: SizeValidation): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (!Array.isArray(value)) {
        return {
          result: false,
          message: message || `Invalid ${key} input. Cause: it is not a valid array.`,
        };
      }

      if (sizeValidation) {
        if (sizeValidation.max && value.length > sizeValidation.max) {
          return {
            result: false,
            message: message || `Invalid ${key} input. Cause: it exceeds the maximum size of ${sizeValidation.max}.`,
          };
        }

        if (sizeValidation.min && value.length < sizeValidation.min) {
          return {
            result: false,
            message: message ||
              `Invalid ${key} input. Cause: it is too small for the minimum size of ${sizeValidation.min}.`,
          };
        }
      }

      return successResponse;
    };
  }
}
