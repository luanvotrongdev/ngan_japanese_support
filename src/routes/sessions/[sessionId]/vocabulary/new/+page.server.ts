import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { vocabularySchema } from '$lib/schemas/learning-content';
import { getSession } from '$lib/server/study-sessions/sessions';
import { createVocabulary } from '$lib/server/study-sessions/vocabulary';
import { formErrors, formValues } from '$lib/server/study-sessions/forms';

export const load: PageServerLoad = ({ locals, params }) => ({ session: getSession(locals.user.id, params.sessionId) });
export const actions: Actions = { default: async ({ request, locals, params }) => {
  const values = formValues(await request.formData());
  const parsed = vocabularySchema.safeParse(values);
  if (!parsed.success) return fail(400, { values, errors: formErrors(parsed.error) });
  createVocabulary(locals.user.id, params.sessionId, parsed.data);
  redirect(303, `/sessions/${params.sessionId}`);
} };
