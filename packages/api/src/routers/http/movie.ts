import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { transformMovies } from '../../transformers/movieTransformer';
import { getPopular, searchMovies } from '../../respositories/movieRepository';

export const movie = createTRPCRouter({
  getPopular: publicProcedure.query(async () => {
    const pMovies = await getPopular();
    return transformMovies(pMovies);
  }),
  search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
    const pMovies = await searchMovies(input.query);
    return transformMovies(pMovies);
  }),
});
