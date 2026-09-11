import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { resolveLocale } from '$lib/i18n';

export const load: LayoutServerLoad = ({ cookies }) => ({
  locale: resolveLocale(cookies.get('lang'))
});