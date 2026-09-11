<script lang="ts">
  import VocabularySection from '$lib/components/VocabularySection.svelte';
  import KanjiSection from '$lib/components/KanjiSection.svelte';
  import GrammarSection from '$lib/components/GrammarSection.svelte';
  let { data, form } = $props();
  function confirmDelete(event: SubmitEvent) { if (!confirm('Delete this session and all of its content?')) event.preventDefault(); }
</script>

<div class="page-shell detail-page">
  <a class="back" href="/sessions">Back to sessions</a>
  <section class="session-heading"><div><p class="eyebrow">Study session</p><h1>{data.session.title}</h1><p>{data.session.notes || 'No notes for this session.'}</p></div><p class="date">Updated {new Date(data.session.updatedAt).toLocaleString()}</p></section>
  <details class="panel edit-panel" open={form?.action === 'update'}><summary>Edit session details</summary><form method="POST" action="?/update"><label>Title <input name="title" value={form?.values?.title ?? data.session.title} required /></label><label>Notes <textarea name="notes" rows="3">{form?.values?.notes ?? data.session.notes ?? ''}</textarea></label>{#each Object.values(form?.errors ?? {}).flat() as message}<p class="field-error">{message}</p>{/each}<button class="primary" type="submit">Save changes</button></form></details>
  <VocabularySection sessionId={data.session.id} entries={data.vocabulary} />
  <KanjiSection sessionId={data.session.id} entries={data.kanji} />
  <GrammarSection sessionId={data.session.id} entries={data.grammar} />
  <section class="danger-zone"><div><h2>Delete session</h2><p>This permanently removes the session and all entries.</p></div><form method="POST" action="?/delete" onsubmit={confirmDelete}><input type="hidden" name="confirmation" value="delete" /><button class="danger" type="submit">Delete session</button></form></section>
</div>
