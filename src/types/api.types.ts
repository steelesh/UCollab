import { type z } from "zod";

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string | z.ZodError };

export type ApiErrorResponse = {
  error: string;
  statusCode: number;
};
