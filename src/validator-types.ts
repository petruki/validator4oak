import type { Context } from './deps.ts';

export type SizeValidation = {
  min?: number;
  max?: number;
};

export type ValidatorParams = {
  key: string;
  validators?: ValidatorFunction[];
  sanitizer?: ValidatorSanitizer[];
  optional?: boolean;
  message?: string;
};

export type ValidatorHeaderParams = {
  key: string;
  validators?: ValidatorFunction[];
  optional?: boolean;
  message?: string;
};

export type ValidatorResponse = {
  result: boolean;
  message: string;
};

export type ValidatorFunction = (value: string, key: string, message?: string) => ValidatorResponse;
export type ValidatorSanitizer = (value: string) => string;
export type ErrorHandler = (context: Context, error: string) => void;
