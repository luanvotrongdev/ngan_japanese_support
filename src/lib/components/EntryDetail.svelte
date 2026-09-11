<script lang="ts">
  import { page } from '$app/state';
  import VocabularyFields from './VocabularyFields.svelte';
  import KanjiFields from './KanjiFields.svelte';
  import GrammarFields from './GrammarFields.svelte';
  import { toLines } from '$lib/schemas/learning-content';
  import { resolveLocale, translate } from '$lib/i18n';

  type ContentType = 'vocabulary' | 'kanji' | 'grammar';
  type FormState = {
    action?: string;
    entryId?: string;
    message?: string;
    values?: Record<string, unknown>;
    errors?: Record<string, string[]>;
  };

  let { type, mode, id, entry, form }: {
    type: ContentType;
    mode: 'new' | 'edit';
    id: string | null;
    entry: Record<string, any> | null;
    form: FormState | null;
  } = $props();

  const locale = $derived(resolveLocale(page.data.locale));
  const t = (key: string, params?: Record<string, string>) => translate(locale, key, params);
  const typeLower = $derived(t(`type.${type}.lower`));
  const action = $derived(`${type}/${mode === 'new' ? 'create' : 'update'}`);
  let busy = $state(false);

  const values = $derived.by(() => {
    if (form && (mode === 'edit' ? form.entryId === id : !form.entryId)) return form.values ?? {};
    if (mode === 'edit' && entry) {
      if (type === 'vocabulary') return { ...entry, examples: toLines(entry.examples) };
      if (type === 'kanji') return { ...entry, onyomi: toLines(entry.onyomi), kunyomi: toLines(entry.kunyomi), relatedVocabulary: toLines(entry.relatedVocabulary), examples: toLines(entry.examples) };
      if (type === 'grammar') return { ...entry, examples: toLines(entry.examples) };
    }
    return {};
  });
  const errors = $derived(form?.action?.startsWith(`${type}/`) ? (form?.errors ?? {}) : {});

  function submit() { busy = true; }
  function confirmDelete(event: SubmitEvent) {
    if (!confirm(t('confirm.deleteEntry', { type: typeLower }))) event.preventDefault();
    else busy = true;
  }
</script>

<div class="detail-panel-inner">
  <p class="eyebrow">{t(`type.${type}`)}</p>
  <h2>{mode === 'new' ? t(`detail.${type}.add`) : t(`detail.${type}.edit`)}</h2>
  <form method="POST" action={`?/${action}`} onsubmit={submit}>
    {#if mode === 'edit'}<input type="hidden" name="entryId" value={id ?? ''} />{/if}
    {#if type === 'vocabulary'}
      <VocabularyFields {values} {errors} />
    {:else if type === 'kanji'}
      <KanjiFields {values} {errors} />
    {:else}
      <GrammarFields {values} {errors} />
    {/if}
    <button class="primary" type="submit" disabled={busy}>{mode === 'new' ? t('btn.addEntry') : t('btn.save')}</button>
  </form>
  {#if mode === 'edit'}
    <form method="POST" action={`?/${type}/delete`} onsubmit={confirmDelete}>
      <input type="hidden" name="entryId" value={id ?? ''} />
      <input type="hidden" name="confirmation" value="delete" />
      {#if form?.action === `${type}/delete` && form?.message}<p class="field-error">{form.message}</p>{/if}
      <button class="danger" type="submit" disabled={busy}>{t('btn.deleteEntry', { type: typeLower })}</button>
    </form>
  {/if}
</div>