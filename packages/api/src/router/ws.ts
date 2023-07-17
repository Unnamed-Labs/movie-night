import { createTRPCRouter } from '../trpc';
import { randomNumber } from './ws/randomNumber';

export const wsRouter = createTRPCRouter({
  randomNumber,
});
