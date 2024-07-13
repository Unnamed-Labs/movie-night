import { client } from '../utils/redisClient';

export const startGame = (lobbyId: string) => {
  client.emit('startGame', lobbyId);
};
