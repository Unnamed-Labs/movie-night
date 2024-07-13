import { createTRPCRouter } from '../trpc';
import { movie } from './http/movie';
import { lobby } from './http/lobby';
import { game } from './http/game';

export const httpRouter = createTRPCRouter({
  movie,
  lobby,
  game,
});
