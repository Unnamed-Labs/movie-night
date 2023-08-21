import { publicProcedure } from '../../trpc';

export const version = publicProcedure.query(() => {
  return { version: '0.1.0' };
});
