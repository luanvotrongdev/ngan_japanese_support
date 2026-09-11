import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { resolveLocale } from '$lib/i18n';

export const load: PageServerLoad = () => {
  redirect(307, '/sessions');
};

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const locale = resolveLocale(String(data.get('lang') ?? ''));
    cookies.set('lang', locale, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
    const from = String(data.get('from') ?? '');
    redirect(303, from.startsWith('/') && !from.startsWith('//') ? from : '/sessions');
  }
};