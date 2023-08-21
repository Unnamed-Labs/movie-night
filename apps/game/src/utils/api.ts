import { httpBatchLink, loggerLink, wsLink, createWSClient, splitLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

import { type AppRouter, type WSRouter } from '@movie/api';
import { type NextPageContext } from 'next';

import { env } from '~/env.mjs';

const getWsLink = (ctx: NextPageContext | undefined) => {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url: `http://${env.NEXT_PUBLIC_SERVER_URL}`,
      headers() {
        if (!ctx?.req?.headers) {
          return {};
        }
        // on ssr, forward client's headers to the server
        return {
          ...ctx.req.headers,
          'x-ssr': '1',
        };
      },
    });
  }
  const client = createWSClient({
    url: `ws://${env.NEXT_PUBLIC_SERVER_URL}`,
  });
  return wsLink<WSRouter>({
    client,
  });
};

export const api = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            return op.type === 'subscription';
          },
          true: getWsLink(ctx),
          false: httpBatchLink({ url: `http://${env.NEXT_PUBLIC_SERVER_URL}` }),
        }),
      ],
    };
  },
  ssr: false,
});
