<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';
  import { resolveLocale, translate } from '$lib/i18n';
  let { children } = $props();
  const locale = $derived(resolveLocale(page.data.locale));
</script>

<svelte:head><title>Ngan Japanese Support</title><meta name="description" content={translate(locale, 'app.description')} /></svelte:head>
<header class="site-header">
  <a class="brand" href="/sessions"><span lang="ja">学</span><strong>{translate(locale, 'app.name')}</strong></a>
  <p>{translate(locale, 'app.localMode')}</p>
  <LanguageToggle />
</header>
<main>{@render children()}</main>