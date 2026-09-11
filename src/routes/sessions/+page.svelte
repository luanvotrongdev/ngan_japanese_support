<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, translate } from '$lib/i18n';
  let { data, form } = $props();
  const locale = $derived(resolveLocale(page.data.locale));
  const t = (key: string, params?: Record<string, string>) => translate(locale, key, params);
  const formatDate = (value: string | Date) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
</script>

<div class="page-shell">
  <section class="hero"><p class="eyebrow">{t('hero.eyebrow')}</p><h1>{t('hero.title')}</h1><p>{t('hero.text')}</p></section>
  <section class="new-session panel"><h2>{t('create.title')}</h2><form method="POST"><label>{t('field.title')} <input name="title" value={form?.values?.title ?? ''} placeholder={t('placeholder.title')} required /></label><label>{t('field.notes')} <textarea name="notes" rows="3" placeholder={t('placeholder.notes')}>{form?.values?.notes ?? ''}</textarea></label>{#each Object.values(form?.errors ?? {}).flat() as message}<p class="field-error">{message}</p>{/each}<button class="primary" type="submit">{t('create.btn')}</button></form></section>
  <section class="sessions"><header><div><p class="eyebrow">{t('library.eyebrow')}</p><h2>{t('library.title')}</h2></div><span>{t('library.total', { count: String(data.sessions.length) })}</span></header>
    {#if data.sessions.length}<div class="session-grid">{#each data.sessions as session}<a class="session-card" href={`/sessions/${session.id}`}><p class="date">{t('library.updated', { date: formatDate(session.updatedAt) })}</p><h3>{session.title}</h3><p>{session.notes || t('library.noNotes')}</p><span>{t('library.open')}</span></a>{/each}</div>
    {:else}<div class="empty large"><span lang="ja">始めましょう</span><p>{t('library.empty')}</p></div>{/if}
  </section>
</div>