<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head><title>Ngan Japanese Support</title><meta name="description" content="A quiet workspace for Japanese study sessions." /></svelte:head>
<header class="site-header"><a class="brand" href="/sessions"><span lang="ja">学</span><strong>Ngan Japanese</strong></a><p>Local learner mode</p></header>
<main>{@render children()}</main>
