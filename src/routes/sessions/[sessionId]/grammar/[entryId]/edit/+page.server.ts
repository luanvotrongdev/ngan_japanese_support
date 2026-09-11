import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { grammarSchema, toLines } from '$lib/schemas/learning-content';
import { getSession } from '$lib/server/study-sessions/sessions';
import { deleteGrammar, getGrammar, updateGrammar } from '$lib/server/study-sessions/grammar';
import { formErrors, formValues } from '$lib/server/study-sessions/forms';

export const load: PageServerLoad = ({ locals, params }) => { const entry = getGrammar(locals.user.id, params.sessionId, params.entryId); return { session: getSession(locals.user.id, params.sessionId), entry: { ...entry, examples: toLines(entry.examples) } }; };
export const actions: Actions = {
  update: async ({ request, locals, params }) => { const values = formValues(await request.formData()); const parsed = grammarSchema.safeParse(values); if (!parsed.success) return fail(400, { values, errors: formErrors(parsed.error) }); updateGrammar(locals.user.id, params.sessionId, params.entryId, parsed.data); redirect(303, `/sessions/${params.sessionId}`); },
  delete: async ({ request, locals, params }) => { if ((await request.formData()).get('confirmation') !== 'delete') return fail(400, { message: 'Deletion was not confirmed' }); deleteGrammar(locals.user.id, params.sessionId, params.entryId); redirect(303, `/sessions/${params.sessionId}`); }
};
