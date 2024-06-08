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
  proposedBy: z.array(z.string().cuid2()),
  votedBy: z.array(z.string().cuid2()),
});

export type Movie = z.infer<typeof MovieSchema>;
