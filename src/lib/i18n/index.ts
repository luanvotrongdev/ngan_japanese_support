import { dictionaries } from './dictionaries';
import type { DictionaryKey } from './dictionaries';

export type Locale = 'vi' | 'en';

export const DEFAULT_LOCALE: Locale = 'vi';

export interface LocaleStrings {
  vi?: string;
  en: string;
}

export function resolveLocale(value: string | null | undefined): Locale {
  return value === 'en' ? 'en' : DEFAULT_LOCALE;
}

export function pick(locale: Locale, strings: LocaleStrings): string {
  return locale === 'vi' && strings.vi ? strings.vi : strings.en;
}

function interpolate(template: string, params: Record<string, string> | undefined): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? params[name] : match
  );
}

export function translate(
  locale: Locale,
  key: DictionaryKey | (string & {}),
  params?: Record<string, string>
): string {
  const strings = (dictionaries as Record<string, LocaleStrings>)[key as string];
  if (!strings) return key;
  return interpolate(pick(locale, strings), params);
}

const ERROR_TOKEN = /^(required|tooLong):([a-zA-Z]+)$/;

function translateErrorToken(token: string, locale: Locale): string {
  const match = ERROR_TOKEN.exec(token);
  if (!match) return token;
  const kind = match[1] as 'required' | 'tooLong';
  const field = match[2];
  const fieldLabel = translate(locale, `field.${field}`);
  return translate(locale, `error.${kind}`, { field: fieldLabel });
}

export function localizeErrors(
  errors: Record<string, string[]>,
  locale: Locale
): Record<string, string[]> {
  const localized: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(errors)) {
    localized[field] = messages.map((message) => translateErrorToken(message, locale));
  }
  return localized;
}