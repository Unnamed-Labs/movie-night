import { z } from 'zod';

export const MovieSchema = z.object({
  id: z.string().cuid2(),
  date: z.string(),
  title: z.string(),
  rating: z.string(),
  runtime: z.string(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
});

export type Movie = z.infer<typeof MovieSchema>;
