<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, translate, type Locale } from '$lib/i18n';

  const locale = $derived(resolveLocale(page.data.locale));
  const target: Locale = $derived(locale === 'vi' ? 'en' : 'vi');
  const label = $derived(translate(target, `lang.name.${target}`));
</script>

<form method="POST" action="/set-language" class="lang-toggle">
  <input type="hidden" name="lang" value={target} />
  <input type="hidden" name="from" value={page.url.pathname + page.url.search} />
  <button class="lang-button" type="submit">{label}</button>
</form>

<style>
  .lang-toggle {
    display: inline-flex;
  }
  .lang-button {
    font: inherit;
    font-size: 0.85rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    color: var(--ink);
    cursor: pointer;
  }
  .lang-button:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>