export type ErrorPayload = {
  error: string;
}

export interface ErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
}