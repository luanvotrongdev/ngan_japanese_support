<script lang="ts">
  let { data, form } = $props();
</script>

<div class="page-shell">
  <section class="hero"><p class="eyebrow">Your study archive</p><h1>Build lessons worth returning to.</h1><p>Collect the words, characters, and patterns that make Japanese click.</p></section>
  <section class="new-session panel"><h2>Start a session</h2><form method="POST"><label>Title <input name="title" value={form?.values?.title ?? ''} placeholder="Chapter 1: Introductions" required /></label><label>Notes <textarea name="notes" rows="3" placeholder="Goals, source material, or reminders">{form?.values?.notes ?? ''}</textarea></label>{#each Object.values(form?.errors ?? {}).flat() as message}<p class="field-error">{message}</p>{/each}<button class="primary" type="submit">Create session</button></form></section>
  <section class="sessions"><header><div><p class="eyebrow">Library</p><h2>Study sessions</h2></div><span>{data.sessions.length} total</span></header>
    {#if data.sessions.length}<div class="session-grid">{#each data.sessions as session}<a class="session-card" href={`/sessions/${session.id}`}><p class="date">Updated {new Date(session.updatedAt).toLocaleDateString()}</p><h3>{session.title}</h3><p>{session.notes || 'No notes yet'}</p><span>Open session</span></a>{/each}</div>
    {:else}<div class="empty large"><span lang="ja">始めましょう</span><p>Your first lesson begins with a title.</p></div>{/if}
  </section>
</div>
