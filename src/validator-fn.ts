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
        return ValidatorFn.failed(
          message || `Invalid ${key} input. Cause: it exceeds the maximum length of ${sizeValidation.max}.`,
        );
      }

      if (sizeValidation.min && value.length < sizeValidation.min) {
        return ValidatorFn.failed(
          message ||
            `Invalid ${key} input. Cause: it is too short for the minimum length of ${sizeValidation.min}.`,
        );
      }

      return successResponse;
    };
  }

  /**
   * Check if value contains only allowed characters.
   */
  hasAllowedCharacters(
    allowedChars: string,
  ): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      const regex = new RegExp(`^[${allowedChars}]+$`);
      if (!regex.test(value)) {
        return ValidatorFn.failed(
          message ||
            `Invalid ${key} input. Cause: it contains invalid characters. Allowed characters: ${allowedChars}.`,
        );
      }

      return successResponse;
    };
  }

  /**
   * Check if value is in the allowed values.
   */
  isIn(values: string[]): (value: string | string[], key: string, message?: string) => ValidatorResponse {
    return (value: string | string[], key: string, message?: string): ValidatorResponse => {
      const errorResult = ValidatorFn.failed(
        message || `Invalid ${key} input. Cause: it is not in the allowed values.`,
      );

      if (Array.isArray(value)) {
        for (const item of value) {
          if (!values.includes(item)) {
            return errorResult;
          }
        }
      } else if (!values.includes(value)) {
        return errorResult;
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
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it is not a valid URL.`);
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
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it is not a valid number.`);
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
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it is not a valid boolean.`);
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
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it is not a valid array.`);
      }

      if (sizeValidation) {
        if (sizeValidation.max && value.length > sizeValidation.max) {
          return ValidatorFn.failed(
            message || `Invalid ${key} input. Cause: it exceeds the maximum size of ${sizeValidation.max}.`,
          );
        }

        if (sizeValidation.min && value.length < sizeValidation.min) {
          return ValidatorFn.failed(
            message ||
              `Invalid ${key} input. Cause: it is too small for the minimum size of ${sizeValidation.min}.`,
          );
        }
      }

      return successResponse;
    };
  }

  /**
   * Check if value is an object type.
   */
  isObject(): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it is not a valid object.`);
      }

      return successResponse;
    };
  }

  /**
   * Check if value is a string type.
   */
  isString(): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (typeof value !== 'string') {
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it is not a valid string.`);
      }

      return successResponse;
    };
  }

  /**
   * Check if value contains a specific substring.
   */
  contains(
    search: string,
    caseSensitive: boolean = false,
  ): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      const searchValue = caseSensitive ? search : search.toLowerCase();
      const valueToCheck = caseSensitive ? value : value.toLowerCase();

      if (!valueToCheck.includes(searchValue)) {
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it does not contain "${search}".`);
      }

      return successResponse;
    };
  }

  /**
   * Check if value matches a specific pattern.
   */
  matches(
    pattern: RegExp,
  ): (value: string, key: string, message?: string) => ValidatorResponse {
    return (value: string, key: string, message?: string): ValidatorResponse => {
      if (!pattern.test(value)) {
        return ValidatorFn.failed(message || `Invalid ${key} input. Cause: it does not match the pattern.`);
      }

      return successResponse;
    };
  }

  private static failed(message: string) {
    return {
      result: false,
      message,
    };
  }
}
