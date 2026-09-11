<script lang="ts">
  let { values = {}, errors = {}, submitLabel = 'Save grammar' }: {
    values?: Record<string, unknown>; errors?: Record<string, string[]>; submitLabel?: string
  } = $props();
  const text = (name: string) => String(values[name] ?? '');
</script>

<div class="form-grid">
  <label>Grammar pattern <input name="grammar" value={text('grammar')} required /></label>
  <label>Meaning <input name="meaning" value={text('meaning')} required /></label>
  <label class="wide">Usage <textarea name="usage" rows="4" required>{text('usage')}</textarea></label>
  <label class="wide">Nuance <textarea name="nuance" rows="3">{text('nuance')}</textarea></label>
  <label class="wide">Examples <span>One example per line</span><textarea name="examples" rows="6">{text('examples')}</textarea></label>
</div>
{#each Object.values(errors).flat() as message}<p class="field-error">{message}</p>{/each}
<button class="primary" type="submit">{submitLabel}</button>
