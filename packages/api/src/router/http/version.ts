import { publicProcedure } from '../../trpc';

export const version = publicProcedure.query(() => {
  return { version: '0.42.0' };
});
