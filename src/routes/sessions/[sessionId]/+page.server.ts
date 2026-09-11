import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { studySessionSchema } from '$lib/schemas/study-session';
import { grammarSchema, kanjiSchema, vocabularySchema } from '$lib/schemas/learning-content';
import { deleteSession, getSessionContent, updateSession } from '$lib/server/study-sessions/sessions';
import { createVocabulary, deleteVocabulary, updateVocabulary } from '$lib/server/study-sessions/vocabulary';
import { createKanji, deleteKanji, updateKanji } from '$lib/server/study-sessions/kanji';
import { createGrammar, deleteGrammar, updateGrammar } from '$lib/server/study-sessions/grammar';
import { formErrors, formValues } from '$lib/server/study-sessions/forms';

type ContentType = 'vocabulary' | 'kanji' | 'grammar';

export const load: PageServerLoad = ({ locals, params }) => {
  const { session, vocabulary, kanji, grammar } = getSessionContent(locals.user.id, params.sessionId);
  const order: Record<ContentType, number> = { vocabulary: 0, kanji: 1, grammar: 2 };
  const entries = [
    ...vocabulary.map((e) => ({ type: 'vocabulary' as const, id: e.id, title: e.vocabulary, subtitle: e.reading })),
    ...kanji.map((e) => ({ type: 'kanji' as const, id: e.id, title: e.kanji, subtitle: [...e.onyomi, ...e.kunyomi].join(' / ') })),
    ...grammar.map((e) => ({ type: 'grammar' as const, id: e.id, title: e.grammar, subtitle: e.usage }))
  ].sort((a, b) => order[a.type] - order[b.type] || a.title.localeCompare(b.title));
  return { session, entries, vocabulary, kanji, grammar };
};

const contentActions = (type: ContentType) => ({
  [`${type}/create`]: async (event: RequestEvent) => {
    const values = formValues(await event.request.formData());
    if (type === 'vocabulary') {
      const parsed = vocabularySchema.safeParse(values);
      if (!parsed.success) return fail(400, { action: `${type}/create`, values, errors: formErrors(parsed.error) });
      const id = createVocabulary(event.locals.user.id, event.params.sessionId, parsed.data);
      redirect(303, `/sessions/${event.params.sessionId}?entry=${type}:${id}`);
    } else if (type === 'kanji') {
      const parsed = kanjiSchema.safeParse(values);
      if (!parsed.success) return fail(400, { action: `${type}/create`, values, errors: formErrors(parsed.error) });
      const id = createKanji(event.locals.user.id, event.params.sessionId, parsed.data);
      redirect(303, `/sessions/${event.params.sessionId}?entry=${type}:${id}`);
    } else {
      const parsed = grammarSchema.safeParse(values);
      if (!parsed.success) return fail(400, { action: `${type}/create`, values, errors: formErrors(parsed.error) });
      const id = createGrammar(event.locals.user.id, event.params.sessionId, parsed.data);
      redirect(303, `/sessions/${event.params.sessionId}?entry=${type}:${id}`);
    }
  },
  [`${type}/update`]: async (event: RequestEvent) => {
    const values = formValues(await event.request.formData());
    const entryId = String(values.entryId ?? '');
    if (type === 'vocabulary') {
      const parsed = vocabularySchema.safeParse(values);
      if (!parsed.success) return fail(400, { action: `${type}/update`, entryId, values, errors: formErrors(parsed.error) });
      updateVocabulary(event.locals.user.id, event.params.sessionId, entryId, parsed.data);
      redirect(303, `/sessions/${event.params.sessionId}?entry=${type}:${entryId}`);
    } else if (type === 'kanji') {
      const parsed = kanjiSchema.safeParse(values);
      if (!parsed.success) return fail(400, { action: `${type}/update`, entryId, values, errors: formErrors(parsed.error) });
      updateKanji(event.locals.user.id, event.params.sessionId, entryId, parsed.data);
      redirect(303, `/sessions/${event.params.sessionId}?entry=${type}:${entryId}`);
    } else {
      const parsed = grammarSchema.safeParse(values);
      if (!parsed.success) return fail(400, { action: `${type}/update`, entryId, values, errors: formErrors(parsed.error) });
      updateGrammar(event.locals.user.id, event.params.sessionId, entryId, parsed.data);
      redirect(303, `/sessions/${event.params.sessionId}?entry=${type}:${entryId}`);
    }
  },
  [`${type}/delete`]: async (event: RequestEvent) => {
    const values = formValues(await event.request.formData());
    const entryId = String(values.entryId ?? '');
    if (values.confirmation !== 'delete') return fail(400, { action: `${type}/delete`, entryId, message: 'Deletion was not confirmed' });
    if (type === 'vocabulary') deleteVocabulary(event.locals.user.id, event.params.sessionId, entryId);
    else if (type === 'kanji') deleteKanji(event.locals.user.id, event.params.sessionId, entryId);
    else deleteGrammar(event.locals.user.id, event.params.sessionId, entryId);
    redirect(303, `/sessions/${event.params.sessionId}`);
  }
});

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
  },
  ...contentActions('vocabulary'),
  ...contentActions('kanji'),
  ...contentActions('grammar')
};