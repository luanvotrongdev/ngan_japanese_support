<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, translate } from '$lib/i18n';
  const locale = $derived(resolveLocale(page.data.locale));
  // Server errors carry i18n keys (e.g. notFound.session); unknown messages pass through unchanged.
  const message = $derived(page.error?.message ? translate(locale, page.error.message) : '');
</script>

<div class="page-shell">
  <section class="hero"><p class="eyebrow">{page.status}</p><h1>{translate(locale, 'errorPage.title')}</h1>{#if message}<p>{message}</p>{/if}<a class="back" href="/sessions">{translate(locale, 'errorPage.back')}</a></section>
</div>
