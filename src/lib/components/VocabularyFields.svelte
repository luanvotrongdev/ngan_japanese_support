<script lang="ts">
  let { values = {}, errors = {} }: { values?: Record<string, unknown>; errors?: Record<string, string[]> } = $props();
  const text = (name: string) => String(values[name] ?? '');
  const error = (name: string) => errors[name]?.[0] ?? null;
</script>

<div class="form-grid">
  <label>Vocabulary <input name="vocabulary" value={text('vocabulary')} required />{#if error('vocabulary')}<em class="error">{error('vocabulary')}</em>{/if}</label>
  <label>Reading <input name="reading" value={text('reading')} required />{#if error('reading')}<em class="error">{error('reading')}</em>{/if}</label>
  <label class="wide">Meaning <input name="meaning" value={text('meaning')} required />{#if error('meaning')}<em class="error">{error('meaning')}</em>{/if}</label>
  <label class="wide">Nuance <span>(optional)</span><textarea name="nuance" rows="3">{text('nuance')}</textarea>{#if error('nuance')}<em class="error">{error('nuance')}</em>{/if}</label>
  <label class="wide">Examples <span>One example per line</span><textarea name="examples" rows="6">{text('examples')}</textarea>{#if error('examples')}<em class="error">{error('examples')}</em>{/if}</label>
</div>