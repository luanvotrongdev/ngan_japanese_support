<script lang="ts">
  let { sessionId, entries }: { sessionId: string; entries: Array<{ id: string; kanji: string; onyomi: string[]; kunyomi: string[]; meaning: string }> } = $props();
</script>

<section class="content-section" aria-labelledby="kanji-heading">
  <header><div><p class="eyebrow">Characters</p><h2 id="kanji-heading">Kanji</h2></div><a class="button" href={`/sessions/${sessionId}/kanji/new`}>Add kanji</a></header>
  {#if entries.length}
    <div class="entry-grid">{#each entries as entry}
      <article class="entry-card kanji-card"><a class="entry-link" href={`/sessions/${sessionId}/kanji/${entry.id}/edit`}><h3>{entry.kanji}</h3><p>{entry.meaning}</p><p class="reading">{[...entry.onyomi, ...entry.kunyomi].join(' / ') || 'No readings'}</p><span>Edit entry</span></a></article>
    {/each}</div>
  {:else}<p class="empty">No kanji yet. Add a character when you are ready.</p>{/if}
</section>
