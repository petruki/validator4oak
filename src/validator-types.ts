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

export type IContext = {
  request: {
    body: Body;
    headers: Headers;
    url: URL;
    query: URLSearchParams;
  };
  response: {
    status: number;
    body: Record<string, unknown>;
  };
  state: Record<string | number | symbol, any>;
}

export type INext = () => Promise<unknown>;

export type ValidatorFunction = (value: string, key: string, message?: string) => ValidatorResponse;
export type ValidatorSanitizer = (value: string) => string;
export type ErrorHandler = (context: any, error: string) => void;
