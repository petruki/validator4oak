import type { SizeValidation, ValidatorResponse } from './validator-types.ts';

const successResponse = { result: true, message: 'valid' };

export class ValidatorFn {
  static createValidator() {
    return new ValidatorFn();
  }

  hasLenght(sizeValidation: SizeValidation) {
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

  isUrl() {
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

  isNumeric() {
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

  isBoolean() {
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

  isArray(sizeValidation?: SizeValidation) {
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
