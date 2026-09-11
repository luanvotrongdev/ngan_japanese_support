<script lang="ts">
  let { values = {}, errors = {} }: { values?: Record<string, unknown>; errors?: Record<string, string[]> } = $props();
  const text = (name: string) => String(values[name] ?? '');
  const error = (name: string) => errors[name]?.[0] ?? null;
</script>

<div class="form-grid">
  <label>Kanji <input name="kanji" value={text('kanji')} required lang="ja" />{#if error('kanji')}<em class="error">{error('kanji')}</em>{/if}</label>
  <label>Meaning <input name="meaning" value={text('meaning')} required />{#if error('meaning')}<em class="error">{error('meaning')}</em>{/if}</label>
  <label>Onyomi <span>One reading per line</span><textarea name="onyomi" rows="4">{text('onyomi')}</textarea>{#if error('onyomi')}<em class="error">{error('onyomi')}</em>{/if}</label>
  <label>Kunyomi <span>One reading per line</span><textarea name="kunyomi" rows="4">{text('kunyomi')}</textarea>{#if error('kunyomi')}<em class="error">{error('kunyomi')}</em>{/if}</label>
  <label class="wide">Related vocabulary <span>One item per line</span><textarea name="relatedVocabulary" rows="4">{text('relatedVocabulary')}</textarea>{#if error('relatedVocabulary')}<em class="error">{error('relatedVocabulary')}</em>{/if}</label>
  <label class="wide">Examples <span>One example per line</span><textarea name="examples" rows="6">{text('examples')}</textarea>{#if error('examples')}<em class="error">{error('examples')}</em>{/if}</label>
</div>