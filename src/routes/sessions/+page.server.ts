import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { studySessionSchema } from '$lib/schemas/study-session';
import { createSession, listSessions } from '$lib/server/study-sessions/sessions';
import { formErrors, formValues } from '$lib/server/study-sessions/forms';
import { localizeErrors, resolveLocale } from '$lib/i18n';

export const load: PageServerLoad = ({ locals }) => ({ sessions: listSessions(locals.user.id) });

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const values = formValues(await request.formData());
    const parsed = studySessionSchema.safeParse(values);
    if (!parsed.success)
      return fail(400, { values, errors: localizeErrors(formErrors(parsed.error), resolveLocale(cookies.get('lang'))) });
    const session = createSession(locals.user.id, parsed.data);
    redirect(303, `/sessions/${session.id}`);
  }
};