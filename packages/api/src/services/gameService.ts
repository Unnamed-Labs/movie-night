import { Logger, type ILogObj } from 'tslog';
import * as emit from '../publishers/gamePublishers';

const log: Logger<ILogObj> = new Logger();

export const startGame = (lobbyId: string) => {
  try {
    emit.startGame(lobbyId);
  } catch (e) {
    log.error('lobby failed to emit user to subscribers:', e);
  }
};
