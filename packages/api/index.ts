import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { httpRouter, type HttpRouter, wsRouter, type WSRouter } from './src/index';
import { mergeTRPCRouter } from './src/trpc';

export { httpRouter, type HttpRouter, wsRouter, type WSRouter } from './src/index';
export { createTRPCContext, createInnerTRPCContext } from './src/trpc';

export type HttpRouterInputs = inferRouterInputs<HttpRouter>;
export type HttpRouterOutputs = inferRouterOutputs<HttpRouter>;

export type WSRouterInputs = inferRouterInputs<WSRouter>;
export type WSRouterOutputs = inferRouterOutputs<WSRouter>;

export const appRouter = mergeTRPCRouter(httpRouter, wsRouter);

export type AppRouter = typeof appRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { Movie } from './src/types/Movie';
