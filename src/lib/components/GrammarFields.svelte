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
  <label>{t('field.grammar')} <input name="grammar" value={text('grammar')} required />{#if error('grammar')}<em class="error">{error('grammar')}</em>{/if}</label>
  <label>{t('field.meaning')} <input name="meaning" value={text('meaning')} required />{#if error('meaning')}<em class="error">{error('meaning')}</em>{/if}</label>
  <label class="wide">{t('field.usage')} <textarea name="usage" rows="4" required>{text('usage')}</textarea>{#if error('usage')}<em class="error">{error('usage')}</em>{/if}</label>
  <label class="wide">{t('field.nuance')} <span>{t('hint.optional')}</span><textarea name="nuance" rows="3">{text('nuance')}</textarea>{#if error('nuance')}<em class="error">{error('nuance')}</em>{/if}</label>
  <label class="wide">{t('field.examples')} <span>{t('hint.examples')}</span><textarea name="examples" rows="6">{text('examples')}</textarea>{#if error('examples')}<em class="error">{error('examples')}</em>{/if}</label>
</div>