<script lang="ts">
  import { page } from '$app/state';
  import ContentList from '$lib/components/ContentList.svelte';
  import EntryDetail from '$lib/components/EntryDetail.svelte';
  let { data, form } = $props();
  const types = ['vocabulary', 'kanji', 'grammar'] as const;
  type ContentType = (typeof types)[number];

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

  function confirmDelete(event: SubmitEvent) { if (!confirm('Delete this session and all of its content?')) event.preventDefault(); }
</script>

<div class="page-shell detail-page">
  <a class="back" href="/sessions">Back to sessions</a>
  <section class="session-heading"><div><p class="eyebrow">Study session</p><h1>{data.session.title}</h1><p>{data.session.notes || 'No notes for this session.'}</p></div><p class="date">Updated {new Date(data.session.updatedAt).toLocaleString()}</p></section>
  <details class="panel edit-panel" open={form?.action === 'update'}><summary>Edit session details</summary><form method="POST" action="?/update"><label>Title <input name="title" value={form?.values?.title ?? data.session.title} required /></label><label>Notes <textarea name="notes" rows="3">{form?.values?.notes ?? data.session.notes ?? ''}</textarea></label>{#each Object.values(form?.errors ?? {}).flat() as message}<p class="field-error">{message}</p>{/each}<button class="primary" type="submit">Save changes</button></form></details>

  <div class="md-layout">
    <ContentList entries={data.entries} selectedKey={panel && panel.mode === 'edit' ? `${panel.type}:${panel.id}` : null} newType={panel && panel.mode === 'new' ? panel.type : null} />
    <section class="panel detail-panel">
      {#if panel}
        <EntryDetail type={panel.type} mode={panel.mode} id={panel.id} entry={selectedEntry} form={form} />
      {:else}
        <div class="detail-empty"><p class="eyebrow">Entry details</p><h2>Nothing selected</h2><p>Choose an entry from the list to view or edit it, or use the buttons above to add a vocabulary, kanji, or grammar entry.</p></div>
      {/if}
    </section>
  </div>

  <section class="danger-zone"><div><h2>Delete session</h2><p>This permanently removes the session and all entries.</p></div><form method="POST" action="?/delete" onsubmit={confirmDelete}><input type="hidden" name="confirmation" value="delete" /><button class="danger" type="submit">Delete session</button></form></section>
</div>