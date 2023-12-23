import { createTRPCRouter } from '../trpc';
import { lobby } from './ws/lobby';

export const wsRouter = createTRPCRouter({
  lobbyWs: lobby,
});
