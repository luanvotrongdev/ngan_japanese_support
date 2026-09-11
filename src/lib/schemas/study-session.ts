import { z } from 'zod';

export const studySessionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  notes: z.string().trim().max(4000, 'Notes are too long').transform((value) => value || null)
});

export type StudySessionInput = z.infer<typeof studySessionSchema>;
