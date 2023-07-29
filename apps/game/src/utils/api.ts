import { httpBatchLink, loggerLink, wsLink, createWSClient, splitLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

import { type AppRouter, type WSRouter } from '@movie/api';
import { type NextPageContext } from 'next';

import { env } from '~/env.mjs';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return env.NEXT_PUBLIC_HTTP_URL; // dev SSR should use localhost
};

const getWsLink = (ctx: NextPageContext | undefined) => {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
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
    url: env.NEXT_PUBLIC_WS_URL,
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
          false: httpBatchLink({ url: `${getBaseUrl()}/api/trpc` }),
        }),
      ],
    };
  },
  ssr: false,
});
