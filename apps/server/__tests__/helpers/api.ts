import {
  createTRPCProxyClient,
  httpBatchLink,
  loggerLink,
  wsLink,
  createWSClient,
  splitLink,
} from '@trpc/client';
import superjson from 'superjson';
import { type AppRouter, type WSRouter } from '@movie/api';
import './polyfill';

const getWsLink = () => {
  const client = createWSClient({
    url: `ws://${process.env.NEXT_PUBLIC_SERVER_URL}`,
  });
  return wsLink<WSRouter>({
    client,
  });
};

export const api = createTRPCProxyClient<AppRouter>({
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
      true: getWsLink(),
      false: httpBatchLink({ url: `http://${process.env.NEXT_PUBLIC_SERVER_URL}` }),
    }),
  ],
});
