import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { users } from '$lib/server/db/schema';

const localUser = { id: 'local-user', displayName: 'Local learner' };

export const handle: Handle = async ({ event, resolve }) => {
  db.insert(users).values(localUser).onConflictDoNothing().run();
  event.locals.user = localUser;
  return resolve(event);
};
