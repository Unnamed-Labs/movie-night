import { createTRPCRouter } from '../trpc';
import { version } from './http/version';
import { hello } from './http/hello';
import { movie } from './http/movie';
import { room } from './http/room';
import { participant } from './http/participant';

export const httpRouter = createTRPCRouter({
  version,
  hello,
  movie,
  room,
  participant,
});
