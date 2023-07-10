import { httpRouter } from './router/http';
import { wsRouter } from './router/ws';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  http: httpRouter,
  ws: wsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
