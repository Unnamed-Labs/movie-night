import { createTRPCRouter } from '../trpc';
import { version } from './http/version';
import { hello } from './http/hello';

export const httpRouter = createTRPCRouter({
  version,
  hello,
});
