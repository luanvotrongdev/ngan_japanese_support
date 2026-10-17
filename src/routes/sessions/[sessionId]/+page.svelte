<script lang="ts">
  import { page } from '$app/state';
  import ContentList from '$lib/components/ContentList.svelte';
  import EntryDetail from '$lib/components/EntryDetail.svelte';
  import SessionFields from '$lib/components/SessionFields.svelte';
  import { resolveLocale, translate } from '$lib/i18n';
  let { data, form } = $props();
  const types = ['vocabulary', 'kanji', 'grammar'] as const;
  type ContentType = (typeof types)[number];

  const locale = $derived(resolveLocale(page.data.locale));
  const t = (key: string, params?: Record<string, string>) => translate(locale, key, params);
  const formatDateTime = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

  const panel = $derived.by(() => {
    const entry = page.url.searchParams.get('entry');
    if (entry) {
      const [rawType, id] = entry.split(':', 2);
      const type = types.includes(rawType as ContentType) ? (rawType as ContentType) : null;
      const found = !type ? null
        : type === 'vocabulary' ? data.vocabulary.find((e) => e.id === id)
        : type === 'kanji' ? data.kanji.find((e) => e.id === id)
        : data.grammar.find((e) => e.id === id);
      if (type && id && found) return { mode: 'edit' as const, type, id };
      return null;
    }
    const fresh = page.url.searchParams.get('new');
    if (fresh && types.includes(fresh as ContentType)) return { mode: 'new' as const, type: fresh as ContentType, id: null };
    return null;
  });
  const selectedEntry = $derived(panel && panel.mode === 'edit'
    ? (panel.type === 'vocabulary' ? data.vocabulary.find((e) => e.id === panel.id)
      : panel.type === 'kanji' ? data.kanji.find((e) => e.id === panel.id)
      : data.grammar.find((e) => e.id === panel.id)) ?? null
    : null);

  let busy = $state(false);
  function confirmDelete(event: SubmitEvent) {
    if (!confirm(t('confirm.deleteSession'))) event.preventDefault();
    else busy = true;
  }
</script>

<div class="page-shell detail-page">
  <a class="back" href="/sessions">{t('detail.back')}</a>
  <section class="session-heading"><div><p class="eyebrow">{t('detail.eyebrow')}</p><h1>{data.session.title}</h1><p>{data.session.notes || t('detail.noNotes')}</p></div><div class="date"><p>{t('detail.created', { date: formatDateTime(data.session.createdAt) })}</p><p>{t('detail.updated', { date: formatDateTime(data.session.updatedAt) })}</p></div></section>
  <details class="panel edit-panel" open={form?.action === 'update'}><summary>{t('edit.title')}</summary><form method="POST" action="?/update" onsubmit={() => (busy = true)}><SessionFields values={form?.action === 'update' ? form.values : data.session} errors={form?.action === 'update' ? form.errors : {}} /><button class="primary" type="submit" disabled={busy}>{t('btn.save')}</button></form></details>

  <div class="md-layout">
    <ContentList entries={data.entries} selectedKey={panel && panel.mode === 'edit' ? `${panel.type}:${panel.id}` : null} newType={panel && panel.mode === 'new' ? panel.type : null} />
    <section id="detail" class="panel detail-panel">
      {#if panel}
        <EntryDetail type={panel.type} mode={panel.mode} id={panel.id} entry={selectedEntry} form={form} />
      {:else}
        <div class="detail-empty"><p class="eyebrow">{t('detail.empty.eyebrow')}</p><h2>{t('detail.empty.title')}</h2><p>{t('detail.empty.body')}</p></div>
      {/if}
    </section>
  </div>

  <section class="danger-zone"><div><h2>{t('danger.title')}</h2><p>{t('danger.body')}</p></div><form method="POST" action="?/delete" onsubmit={confirmDelete}><input type="hidden" name="confirmation" value="delete" /><button class="danger" type="submit" disabled={busy}>{t('danger.btn')}</button></form></section>
</div>