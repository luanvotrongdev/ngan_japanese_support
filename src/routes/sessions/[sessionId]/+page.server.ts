import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { studySessionSchema } from '$lib/schemas/study-session';
import { deleteSession, getSessionContent, updateSession } from '$lib/server/study-sessions/sessions';
import { formErrors, formValues } from '$lib/server/study-sessions/forms';

export const load: PageServerLoad = ({ locals, params }) => getSessionContent(locals.user.id, params.sessionId);

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    const values = formValues(await request.formData());
    const parsed = studySessionSchema.safeParse(values);
    if (!parsed.success) return fail(400, { action: 'update', values, errors: formErrors(parsed.error) });
    updateSession(locals.user.id, params.sessionId, parsed.data);
    redirect(303, `/sessions/${params.sessionId}`);
  },
  delete: async ({ request, locals, params }) => {
    if ((await request.formData()).get('confirmation') !== 'delete') return fail(400, { action: 'delete', message: 'Deletion was not confirmed' });
    deleteSession(locals.user.id, params.sessionId);
    redirect(303, '/sessions');
  }
};
