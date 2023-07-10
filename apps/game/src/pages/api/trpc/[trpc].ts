import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter, createTRPCContext } from '@movie/api';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
