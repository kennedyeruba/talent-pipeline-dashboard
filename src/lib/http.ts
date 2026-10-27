import type { ZodError } from "zod";

export const UNEXPECTED_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export function validationError(error: ZodError) {
  return jsonError(error.issues[0]?.message ?? "Invalid request", 400);
}

/** Log the real error for the server, and give the client a generic message. */
export function unexpectedError(error: unknown) {
  console.error(error);
  return jsonError(UNEXPECTED_ERROR_MESSAGE, 500);
}
