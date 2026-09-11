<script lang="ts">
  import { page } from '$app/state';
  import { resolveLocale, translate } from '$lib/i18n';
  let { values = {}, errors = {} }: { values?: Record<string, unknown>; errors?: Record<string, string[]> } = $props();
  const locale = $derived(resolveLocale(page.data.locale));
  const t = (key: string, params?: Record<string, string>) => translate(locale, key, params);
  const text = (name: string) => String(values[name] ?? '');
  const error = (name: string) => errors[name]?.[0] ?? null;
</script>

<div class="form-grid">
  <label>{t('field.vocabulary')} <input name="vocabulary" value={text('vocabulary')} required />{#if error('vocabulary')}<em class="error">{error('vocabulary')}</em>{/if}</label>
  <label>{t('field.reading')} <input name="reading" value={text('reading')} required />{#if error('reading')}<em class="error">{error('reading')}</em>{/if}</label>
  <label class="wide">{t('field.meaning')} <input name="meaning" value={text('meaning')} required />{#if error('meaning')}<em class="error">{error('meaning')}</em>{/if}</label>
  <label class="wide">{t('field.nuance')} <span>{t('hint.optional')}</span><textarea name="nuance" rows="3">{text('nuance')}</textarea>{#if error('nuance')}<em class="error">{error('nuance')}</em>{/if}</label>
  <label class="wide">{t('field.examples')} <span>{t('hint.examples')}</span><textarea name="examples" rows="6">{text('examples')}</textarea>{#if error('examples')}<em class="error">{error('examples')}</em>{/if}</label>
</div>