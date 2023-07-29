import { createNextApiHandler } from '@trpc/server/adapters/next';
import { httpRouter, createTRPCContext } from '@movie/api';

// export API handler
export default createNextApiHandler({
  router: httpRouter,
  createContext: createTRPCContext,
});
