<script lang="ts">
  let { sessionId, entries }: { sessionId: string; entries: Array<{ id: string; vocabulary: string; reading: string; meaning: string; nuance: string | null; examples: string[] }> } = $props();
</script>

<section class="content-section" aria-labelledby="vocabulary-heading">
  <header><div><p class="eyebrow">Words</p><h2 id="vocabulary-heading">Vocabulary</h2></div><a class="button" href={`/sessions/${sessionId}/vocabulary/new`}>Add vocabulary</a></header>
  {#if entries.length}
    <div class="entry-grid">{#each entries as entry}
      <article class="entry-card"><a class="entry-link" href={`/sessions/${sessionId}/vocabulary/${entry.id}/edit`}><h3>{entry.vocabulary}</h3><p class="reading">{entry.reading}</p><p>{entry.meaning}</p>{#if entry.nuance}<p class="muted">{entry.nuance}</p>{/if}<span>Edit entry</span></a></article>
    {/each}</div>
  {:else}<p class="empty">No vocabulary yet. Add the first word for this session.</p>{/if}
</section>
