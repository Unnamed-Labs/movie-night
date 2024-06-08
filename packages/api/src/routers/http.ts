import { createTRPCRouter } from '../trpc';
import { movie } from './http/movie';
import { lobby } from './http/lobby';

export const httpRouter = createTRPCRouter({
  movie,
  lobby,
});
