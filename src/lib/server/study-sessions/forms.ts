import type { z } from 'zod';

export function formValues(data: FormData) {
  return Object.fromEntries(data.entries());
}

export function formErrors(error: z.ZodError) {
  return error.flatten().fieldErrors;
}
