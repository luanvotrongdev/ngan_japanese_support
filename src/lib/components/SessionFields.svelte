<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, translate } from '$lib/i18n';
  let { values = {}, errors = {}, placeholders = false }: { values?: Record<string, unknown>; errors?: Record<string, string[]>; placeholders?: boolean } = $props();
  const locale = $derived(resolveLocale(page.data.locale));
  const t = (key: string, params?: Record<string, string>) => translate(locale, key, params);
  const text = (name: string) => String(values[name] ?? '');
  const error = (name: string) => errors[name]?.[0] ?? null;
</script>

<label>{t('field.title')} <input name="title" value={text('title')} placeholder={placeholders ? t('placeholder.title') : undefined} required />{#if error('title')}<em class="error">{error('title')}</em>{/if}</label>
<label>{t('field.notes')} <textarea name="notes" rows="3" placeholder={placeholders ? t('placeholder.notes') : undefined}>{text('notes')}</textarea>{#if error('notes')}<em class="error">{error('notes')}</em>{/if}</label>
