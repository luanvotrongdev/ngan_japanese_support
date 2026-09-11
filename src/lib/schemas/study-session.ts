import { z } from 'zod';

export const studySessionSchema = z.object({
  title: z.string().trim().min(1, 'required:title').max(120, 'tooLong:title'),
  notes: z.string().trim().max(4000, 'tooLong:notes').transform((value) => value || null)
});

export type StudySessionInput = z.infer<typeof studySessionSchema>;