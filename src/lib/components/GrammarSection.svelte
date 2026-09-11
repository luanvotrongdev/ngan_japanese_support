<script lang="ts">
  let { sessionId, entries }: { sessionId: string; entries: Array<{ id: string; grammar: string; meaning: string; usage: string; nuance: string | null }> } = $props();
</script>

<section class="content-section" aria-labelledby="grammar-heading">
  <header><div><p class="eyebrow">Patterns</p><h2 id="grammar-heading">Grammar</h2></div><a class="button" href={`/sessions/${sessionId}/grammar/new`}>Add grammar</a></header>
  {#if entries.length}
    <div class="entry-grid">{#each entries as entry}
      <article class="entry-card"><a class="entry-link" href={`/sessions/${sessionId}/grammar/${entry.id}/edit`}><h3>{entry.grammar}</h3><p>{entry.meaning}</p><p class="muted">{entry.usage}</p><span>Edit entry</span></a></article>
    {/each}</div>
  {:else}<p class="empty">No grammar yet. Capture a useful pattern here.</p>{/if}
</section>
