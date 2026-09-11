import { expect, test } from '@playwright/test';

test('defaults to Vietnamese and toggles to English and back', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('/sessions');
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: 'Bắt đầu một buổi học' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tạo buổi học' })).toBeVisible();

  await page.getByRole('button', { name: 'English' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: 'Start a session' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create session' })).toBeVisible();

  const sessionTitle = `N5 vocab ${Date.now()}`;
  await page.getByLabel('Title').fill(sessionTitle);
  await page.getByRole('button', { name: 'Create session' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: sessionTitle, level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Add vocabulary' }).click();
  await page.waitForURL(/new=vocabulary/);
  await page.getByRole('textbox', { name: 'Vocabulary', exact: true }).fill('勉強');
  await page.getByRole('textbox', { name: 'Reading', exact: true }).fill('べんきょう');
  await page.getByRole('textbox', { name: 'Meaning', exact: true }).fill('studying');
  await page.getByRole('button', { name: 'Add entry' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('link', { name: /Vocabulary 勉強/ })).toBeVisible();

  await page.getByRole('button', { name: 'Tiếng Việt' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: sessionTitle, level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Quay lại các buổi học' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Từ vựng 勉強/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Thêm từ vựng' })).toBeVisible();
  await expect(page.getByText(/Cập nhật/)).toBeVisible();
});

test('localizes server validation messages', async ({ page }) => {
  await page.goto('/sessions');
  await page.waitForLoadState('networkidle');

  const longNotes = 'x'.repeat(4001);
  await page.getByLabel('Tiêu đề').fill('Kiểm tra lỗi');
  await page.getByLabel('Ghi chú').fill(longNotes);
  await page.getByRole('button', { name: 'Tạo buổi học' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('Ghi chú quá dài')).toBeVisible();

  await page.getByRole('button', { name: 'English' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Title').fill('Validation check');
  await page.getByLabel('Notes').fill(longNotes);
  await page.getByRole('button', { name: 'Create session' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByText('Notes is too long')).toBeVisible();
});

test('shows a localized session delete confirmation', async ({ page }) => {
  await page.goto('/sessions');
  await page.waitForLoadState('networkidle');

  const sessionTitle = `Xóa ${Date.now()}`;
  await page.getByLabel('Tiêu đề').fill(sessionTitle);
  await page.getByRole('button', { name: 'Tạo buổi học' }).click();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: sessionTitle, level: 1 })).toBeVisible();

  let message = '';
  page.once('dialog', (dialog) => {
    message = dialog.message();
    dialog.accept();
  });
  await page.getByRole('button', { name: 'Xóa buổi học' }).click();
  await page.waitForLoadState('networkidle');
  expect(message).toBe('Xóa buổi học này và toàn bộ nội dung của nó?');
  await expect(page.getByRole('heading', { name: 'Bắt đầu một buổi học' })).toBeVisible();
});