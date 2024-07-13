import { client } from '../utils/redisClient';
import { type Lobby } from '../types/Lobby';

export const putLobby = async (lobby: Lobby) => {
  await client.set(lobby.id, JSON.stringify(lobby));
};

export const getLobby = async (lobbyId: string) => {
  const lobbyFromRedis = await client.get(lobbyId);

  if (!lobbyFromRedis) {
    return null;
  }

  const lobby = JSON.parse(lobbyFromRedis) as Lobby;

  return lobby;
};
