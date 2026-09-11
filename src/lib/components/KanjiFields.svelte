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
  <label>{t('field.kanji')} <input name="kanji" value={text('kanji')} required lang="ja" />{#if error('kanji')}<em class="error">{error('kanji')}</em>{/if}</label>
  <label>{t('field.meaning')} <input name="meaning" value={text('meaning')} required />{#if error('meaning')}<em class="error">{error('meaning')}</em>{/if}</label>
  <label>{t('field.onyomi')} <span>{t('hint.reading')}</span><textarea name="onyomi" rows="4">{text('onyomi')}</textarea>{#if error('onyomi')}<em class="error">{error('onyomi')}</em>{/if}</label>
  <label>{t('field.kunyomi')} <span>{t('hint.reading')}</span><textarea name="kunyomi" rows="4">{text('kunyomi')}</textarea>{#if error('kunyomi')}<em class="error">{error('kunyomi')}</em>{/if}</label>
  <label class="wide">{t('field.relatedVocabulary')} <span>{t('hint.item')}</span><textarea name="relatedVocabulary" rows="4">{text('relatedVocabulary')}</textarea>{#if error('relatedVocabulary')}<em class="error">{error('relatedVocabulary')}</em>{/if}</label>
  <label class="wide">{t('field.examples')} <span>{t('hint.examples')}</span><textarea name="examples" rows="6">{text('examples')}</textarea>{#if error('examples')}<em class="error">{error('examples')}</em>{/if}</label>
</div>