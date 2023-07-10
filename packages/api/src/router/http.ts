import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const httpRouter = createTRPCRouter({
  version: publicProcedure.query(() => {
    return { version: '0.42.0' };
  }),
  hello: publicProcedure
    .input(z.object({ username: z.string().nullish() }).nullish())
    .query(({ input, ctx }) => {
      return {
        text: `hello ${input?.username ?? ctx.session?.user?.name ?? 'world'}`,
      };
    }),
});
