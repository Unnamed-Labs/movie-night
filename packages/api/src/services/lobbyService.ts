import { createId } from '@paralleldrive/cuid2';
import { Logger, type ILogObj } from 'tslog';
import { checkoutRoomCode } from './roomCodeService';
import * as repo from '../respositories/lobbyRepository';
import * as cache from '../caches/lobbyCache';
import * as emit from '../publishers/lobbyPublishers';
import { type User } from '../types/User';
import { type Lobby } from '../types/Lobby';

const log: Logger<ILogObj> = new Logger();

type OpenLobbyParams = {
  name: string;
  accountId?: string;
};

export const openLobby = async ({ name, accountId }: OpenLobbyParams) => {
  let code = null;
  try {
    code = await checkoutRoomCode();
  } catch (e) {
    log.warn('no available room codes');
    return null;
  }

  const user: User = {
    id: createId(),
    name,
    isHost: true,
    accountId,
    hasProposed: false,
    hasVoted: false,
  };

  const lobby: Lobby = {
    id: createId(),
    amount: 8,
    code,
    participants: {
      [user.id]: user,
    },
    movies: {},
  };

  try {
    await repo.createLobby(lobby.id, code);
  } catch (e) {
    log.error('lobby failed to be created in database:', e);
    return null;
  }

  try {
    await cache.putLobby(lobby);
  } catch (e) {
    log.error('lobby failed to be added to cache:', e);
    return null;
  }

  return {
    user,
    lobby,
  };
};

export const closeLobby = async (id: string) => {
  try {
    await repo.updateLobbyById(id, { isActive: false });
  } catch (e) {
    log.error('lobby failed to be updated in database:', e);
  }
};

export const joinLobby = async (code: string, name: string, isHost: boolean) => {
  let id = null;
  try {
    const pRoom = await repo.findActiveLobbyByCode(code);

    if (!pRoom) {
      log.warn(`active lobby not found in db for code [${code}]`);
      return null;
    }

    id = pRoom.id;
  } catch (e) {
    log.error(`error when finding active lobbies by code [${code}]`);
    return null;
  }

  let lobby = null;
  try {
    lobby = await cache.getLobby(id);
  } catch (e) {
    log.error('lobby failed to be found in cache:', e);
    return null;
  }

  if (!lobby) {
    log.warn(`lobby not found in cache for lobbyId [${id}]`);
    return null;
  }

  if (Object.keys(lobby.participants).length >= 8) {
    log.warn(`lobby full, join attempt rejected for lobbyId [${lobby.id}]`);
    return null;
  }

  const user: User = {
    id: createId(),
    name,
    isHost,
    hasProposed: false,
    hasVoted: false,
  };

  const newLobby: Lobby = {
    ...lobby,
    participants: {
      ...lobby.participants,
      [user.id]: user,
    },
  };

  try {
    await cache.putLobby(newLobby);
  } catch (e) {
    log.error('lobby failed to be added to cache:', e);
    return null;
  }

  try {
    emit.addParticipant(newLobby.id, user);
  } catch (e) {
    log.error('lobby failed to emit user to subscribers:', e);
    return null;
  }

  return {
    lobby: newLobby,
    user,
  };
};

export const getMovies = async (id: string) => {
  let lobby = null;
  try {
    lobby = await cache.getLobby(id);
  } catch (e) {
    log.error('lobby failed to be found in cache:', e);
    return null;
  }

  if (!lobby) {
    log.warn(`lobby not found in cache for lobbyId [${id}]`);
    return null;
  }

  return lobby.movies;
};

export const getResult = async (id: string) => {
  let result = null;
  try {
    result = await repo.findLobbyResultById(id);
  } catch (e) {
    log.error(`lobby, [${id}], result failed to be retrieved from database:`, e);
  }

  if (!result) {
    log.warn(`no result found for lobbyId [${id}]`);
    return null;
  }

  if (!result.movie) {
    log.warn(`no movie found for the result of lobbyId [${id}]`);
    return null;
  }

  if (!result.winners || (result.winners && result.winners.length == 0)) {
    log.warn(`no winner found for the result of lobbyId [${id}]`);
  }

  return result;
};
