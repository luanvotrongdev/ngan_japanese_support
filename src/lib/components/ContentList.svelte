<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, translate } from '$lib/i18n';
  type ContentType = 'vocabulary' | 'kanji' | 'grammar';
  type Entry = { type: ContentType; id: string; title: string; subtitle: string };

  let { entries, selectedKey, newType }: {
    entries: Entry[];
    selectedKey: string | null;
    newType: ContentType | null;
  } = $props();

  const locale = $derived(resolveLocale(page.data.locale));
  const t = (key: string, params?: Record<string, string>) => translate(locale, key, params);
  const typeOrder: ContentType[] = ['vocabulary', 'kanji', 'grammar'];
</script>

<nav class="content-list" aria-label={t('content.aria')}>
  <header><div><p class="eyebrow">{t('content.eyebrow')}</p><h2>{t('content.title')}</h2></div><span>{t('content.total', { count: String(entries.length) })}</span></header>
  <div class="add-row">
    {#each typeOrder as type}
      <a href={`?new=${type}#detail`} class:active={newType === type}>{t(`detail.${type}.add`)}</a>
    {/each}
  </div>
  {#if entries.length}
    <ul>
      {#each entries as entry}{@const key = `${entry.type}:${entry.id}`}
        <li>
          <a class="entry-row" class:selected={key === selectedKey} href={`?entry=${key}#detail`} aria-current={key === selectedKey ? 'true' : undefined}>
            <span class="badge {entry.type}">{t(`type.${entry.type}`)}</span>
            <span class="entry-title">{entry.title}</span>
            <span class="entry-subtitle">{entry.subtitle}</span>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">{t('content.empty')}</p>
  {/if}
</nav>