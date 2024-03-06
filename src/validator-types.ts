import { Context } from './deps.ts';

export interface SizeValidation {
  min?: number;
  max?: number;
}

export interface ValidatorParams {
  key: string;
  validators?: ValidatorFunction[];
  sanitizer?: ValidatorSanitizer[];
  optional?: boolean;
  message?: string;
}

export interface ValidatorResponse {
  result: boolean;
  message: string;
}

export type ValidatorFunction = (value: string, key: string, message?: string) => ValidatorResponse;
export type ValidatorSanitizer = (value: string) => string;
export type ErrorHandler = (context: Context, error: string) => void;
