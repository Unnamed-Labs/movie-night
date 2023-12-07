import { createTRPCRouter } from '../trpc';
import { version } from './http/version';
import { hello } from './http/hello';
import { movie } from './http/movie';

export const httpRouter = createTRPCRouter({
  version,
  hello,
  movie,
});
