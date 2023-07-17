import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { httpRouter, type HttpRouter, wsRouter, type WSRouter } from './src/index';
import { createTRPCRouter } from './src/trpc';

export { httpRouter, type HttpRouter, wsRouter, type WSRouter } from './src/index';
export { createTRPCContext } from './src/trpc';

export type HttpRouterInputs = inferRouterInputs<HttpRouter>;
export type HttpRouterOutputs = inferRouterOutputs<HttpRouter>;

export type WSRouterInputs = inferRouterInputs<WSRouter>;
export type WSRouterOutputs = inferRouterOutputs<WSRouter>;

export const appRouter = createTRPCRouter({
  http: httpRouter,
  ws: wsRouter,
});

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
