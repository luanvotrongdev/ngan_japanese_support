import { createSession } from '../src/lib/server/study-sessions/sessions';

export const makeSession = () => createSession('owner', { title: 'N5 particles', notes: 'Chapter one' });
