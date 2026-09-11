import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { grammarSchema } from '$lib/schemas/learning-content';
import { getSession } from '$lib/server/study-sessions/sessions';
import { createGrammar } from '$lib/server/study-sessions/grammar';
import { formErrors, formValues } from '$lib/server/study-sessions/forms';

export const load: PageServerLoad = ({ locals, params }) => ({ session: getSession(locals.user.id, params.sessionId) });
export const actions: Actions = { default: async ({ request, locals, params }) => { const values = formValues(await request.formData()); const parsed = grammarSchema.safeParse(values); if (!parsed.success) return fail(400, { values, errors: formErrors(parsed.error) }); createGrammar(locals.user.id, params.sessionId, parsed.data); redirect(303, `/sessions/${params.sessionId}`); } };
