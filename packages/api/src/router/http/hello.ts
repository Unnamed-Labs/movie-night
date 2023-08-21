import { z } from 'zod';
import { publicProcedure } from '../../trpc';

export const hello = publicProcedure
  .input(z.object({ username: z.string().nullish() }).nullish())
  .query(({ input, ctx }) => {
    return {
      text: `hello ${input?.username ?? ctx.session?.user?.name ?? 'world'}`,
    };
  });
