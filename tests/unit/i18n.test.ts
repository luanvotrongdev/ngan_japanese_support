import { describe, expect, it } from 'vitest';
import { dictionaries } from '$lib/i18n/dictionaries';
import { localizeErrors, pick, resolveLocale, translate } from '$lib/i18n';

describe('dictionary coverage', () => {
  it('defines every key in both languages with non-empty values', () => {
    const keys = Object.keys(dictionaries);
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      const entry = dictionaries[key as keyof typeof dictionaries];
      expect(entry.vi.trim(), `vi for ${key}`).not.toBe('');
      expect(entry.en.trim(), `en for ${key}`).not.toBe('');
    }
  });
});

describe('locale resolution', () => {
  it('defaults to Vietnamese', () => {
    expect(resolveLocale(undefined)).toBe('vi');
    expect(resolveLocale(null)).toBe('vi');
    expect(resolveLocale('')).toBe('vi');
    expect(resolveLocale('fr')).toBe('vi');
  });

  it('accepts English', () => {
    expect(resolveLocale('en')).toBe('en');
  });
});

describe('translate', () => {
  it('returns Vietnamese when locale is vi and English when locale is en', () => {
    expect(translate('vi', 'create.btn')).toBe('Tạo buổi học');
    expect(translate('en', 'create.btn')).toBe('Create session');
  });

  it('interpolates placeholder parameters', () => {
    expect(translate('en', 'library.total', { count: '3' })).toBe('3 total');
    expect(translate('vi', 'library.updated', { date: '2026-09-11' })).toBe('Cập nhật 2026-09-11');
  });

  it('returns the key itself when the key is unknown', () => {
    expect(translate('en', 'missing.key')).toBe('missing.key');
    expect(translate('vi', 'missing.key')).toBe('missing.key');
  });
});

describe('English fallback for untranslated values', () => {
  it('pick falls back to English when Vietnamese is absent', () => {
    const entry = { vi: '', en: 'Fallback text' };
    expect(pick('vi', entry)).toBe('Fallback text');
    expect(pick('en', entry)).toBe('Fallback text');
  });

  it('pick prefers Vietnamese when present', () => {
    expect(pick('vi', { vi: 'Tiếng Việt', en: 'Vietnamese' })).toBe('Tiếng Việt');
  });
});

describe('localizeErrors', () => {
  it('translates required tokens using the field label', () => {
    expect(localizeErrors({ title: ['required:title'] }, 'vi')).toEqual({
      title: ['Hãy nhập Tiêu đề']
    });
    expect(localizeErrors({ vocabulary: ['required:vocabulary'] }, 'en')).toEqual({
      vocabulary: ['Vocabulary is required']
    });
  });

  it('translates tooLong tokens using the field label', () => {
    expect(localizeErrors({ notes: ['tooLong:notes'] }, 'vi')).toEqual({
      notes: ['Ghi chú quá dài']
    });
    expect(localizeErrors({ examples: ['tooLong:examples'] }, 'en')).toEqual({
      examples: ['Examples is too long']
    });
  });

  it('falls back to the raw message for unknown tokens', () => {
    expect(localizeErrors({ title: ['something:else'] }, 'vi')).toEqual({
      title: ['something:else']
    });
  });
});