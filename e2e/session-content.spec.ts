import { expect, test } from '@playwright/test';

test('creates a session and all learning content types', async ({ page }) => {
  const sessionTitle = `JLPT N5 review ${Date.now()}`;
  await page.goto('/sessions');
  await page.getByLabel('Title').fill(sessionTitle);
  await page.getByRole('button', { name: 'Create session' }).click();
  await expect(page.getByRole('heading', { name: sessionTitle, level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Add vocabulary' }).click();
  await page.getByRole('textbox', { name: 'Vocabulary', exact: true }).fill('勉強');
  await page.getByRole('textbox', { name: 'Reading', exact: true }).fill('べんきょう');
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('study');
  await page.getByRole('button', { name: 'Save vocabulary' }).click();
  await expect(page.getByRole('heading', { name: '勉強' })).toBeVisible();

  await page.getByRole('link', { name: 'Add kanji' }).click();
  await page.getByRole('textbox', { name: 'Kanji', exact: true }).fill('学');
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('study');
  await page.getByRole('button', { name: 'Save kanji' }).click();
  await expect(page.getByRole('heading', { name: '学' })).toBeVisible();

  await page.getByRole('link', { name: 'Add grammar' }).click();
  await page.getByRole('textbox', { name: 'Grammar pattern', exact: true }).fill('〜たい');
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('want to');
  await page.getByRole('textbox', { name: 'Usage', exact: true }).fill('verb stem + たい');
  await page.getByRole('button', { name: 'Save grammar' }).click();
  await expect(page.getByRole('heading', { name: '〜たい' })).toBeVisible();
});
