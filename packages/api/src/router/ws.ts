import { createTRPCRouter } from '../trpc';
import { randomNumber } from './ws/randomNumber';
import { lobby } from './ws/lobby';

export const wsRouter = createTRPCRouter({
  randomNumber,
  lobbyWs: lobby,
});
