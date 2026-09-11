import { expect, test } from '@playwright/test';

test('manages all content types on a single session page', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await page.context().addCookies([{ name: 'lang', value: 'en', domain: '127.0.0.1', path: '/' }]);
  const sessionTitle = `JLPT N5 review ${Date.now()}`;
  await page.goto('/sessions');
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Title').fill(sessionTitle);
  await page.getByRole('button', { name: 'Create session' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: sessionTitle, level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Add vocabulary' }).click();
  await page.getByRole('textbox', { name: 'Vocabulary', exact: true }).fill('勉強');
  await page.getByRole('textbox', { name: 'Reading', exact: true }).fill('べんきょう');
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('study');
  await page.getByRole('button', { name: 'Add entry' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('link', { name: /Vocabulary 勉強/ })).toBeVisible();

  await page.getByRole('link', { name: 'Add kanji' }).click();
  await page.getByRole('textbox', { name: 'Kanji', exact: true }).fill('学');
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('study');
  await page.getByRole('button', { name: 'Add entry' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('link', { name: /Kanji 学/ })).toBeVisible();

  await page.getByRole('link', { name: 'Add grammar' }).click();
  await page.getByRole('textbox', { name: 'Grammar pattern', exact: true }).fill('〜たい');
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('want to');
  await page.getByRole('textbox', { name: 'Usage', exact: true }).fill('verb stem + たい');
  await page.getByRole('button', { name: 'Add entry' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('link', { name: /Grammar 〜たい/ })).toBeVisible();

  await page.getByRole('link', { name: /Vocabulary 勉強/ }).click();
  await page.waitForURL(/entry=vocabulary:/);
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('studying');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('textbox', { name: 'Meaning', exact: true })).toHaveValue('studying');

  await page.getByRole('link', { name: /Grammar 〜たい/ }).click();
  await page.waitForURL(/entry=grammar:/);
  await page.getByRole('button', { name: 'Delete grammar' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('link', { name: /Grammar 〜たい/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Vocabulary 勉強/ })).toBeVisible();
});