<script lang="ts">
  type ContentType = 'vocabulary' | 'kanji' | 'grammar';
  type Entry = { type: ContentType; id: string; title: string; subtitle: string };

  let { entries, selectedKey, newType }: {
    entries: Entry[];
    selectedKey: string | null;
    newType: ContentType | null;
  } = $props();

  const badge: Record<ContentType, string> = { vocabulary: 'Vocabulary', kanji: 'Kanji', grammar: 'Grammar' };
  const addLabel: Record<ContentType, string> = { vocabulary: 'Add vocabulary', kanji: 'Add kanji', grammar: 'Add grammar' };
  const typeOrder: ContentType[] = ['vocabulary', 'kanji', 'grammar'];
</script>

<nav class="content-list" aria-label="Session content">
  <header><div><p class="eyebrow">Session content</p><h2>All entries</h2></div><span>{entries.length} total</span></header>
  <div class="add-row">
    {#each typeOrder as type}
      <a href={`?new=${type}#detail`} class:active={newType === type}>{addLabel[type]}</a>
    {/each}
  </div>
  {#if entries.length}
    <ul>
      {#each entries as entry}{@const key = `${entry.type}:${entry.id}`}
        <li>
          <a class="entry-row" class:selected={key === selectedKey} href={`?entry=${key}#detail`} aria-current={key === selectedKey ? 'true' : undefined}>
            <span class="badge {entry.type}">{badge[entry.type]}</span>
            <span class="entry-title">{entry.title}</span>
            <span class="entry-subtitle">{entry.subtitle}</span>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">No vocabulary, kanji, or grammar yet. Use the buttons above to add the first entry.</p>
  {/if}
</nav>