<script lang="ts">
  let { values = {}, errors = {}, submitLabel = 'Save kanji' }: {
    values?: Record<string, unknown>; errors?: Record<string, string[]>; submitLabel?: string
  } = $props();
  const text = (name: string) => String(values[name] ?? '');
</script>

<div class="form-grid">
  <label>Kanji <input name="kanji" value={text('kanji')} required /></label>
  <label>Meaning <input name="meaning" value={text('meaning')} required /></label>
  <label>Onyomi <span>One reading per line</span><textarea name="onyomi" rows="4">{text('onyomi')}</textarea></label>
  <label>Kunyomi <span>One reading per line</span><textarea name="kunyomi" rows="4">{text('kunyomi')}</textarea></label>
  <label class="wide">Related vocabulary <span>One item per line</span><textarea name="relatedVocabulary" rows="4">{text('relatedVocabulary')}</textarea></label>
  <label class="wide">Examples <span>One example per line</span><textarea name="examples" rows="6">{text('examples')}</textarea></label>
</div>
{#each Object.values(errors).flat() as message}<p class="field-error">{message}</p>{/each}
<button class="primary" type="submit">{submitLabel}</button>
