import { client } from '../utils/redisClient';
import { type User } from '../types/User';

export const addParticipant = (id: string, user: User) => {
  client.emit('addParticipant', {
    lobbyId: id,
    user,
  });
};
