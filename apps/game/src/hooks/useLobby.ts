import { useState } from 'react';
import { useLobbyStore } from '~/stores/lobby';
import { api } from '~/utils/api';

export const useLobby = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
  const { body, room, user, setRoom, setBody, setUser } = useLobbyStore((state) => ({
    body: state.body,
    room: state.room,
    user: state.user,
    setBody: state.setBody,
    setRoom: state.setRoom,
    setUser: state.setUser,
  }));

  const { mutateAsync: openRoomAsync } = api.lobby.open.useMutation();
  const { mutateAsync: joinRoomByCodeAsync } = api.lobby.joinRoomByCode.useMutation();

  const openRoom = async (name: string) => {
    setIsLoading(true);
    const lobby = await openRoomAsync({ name });
    if (lobby) {
      setRoom(lobby.room);
      setUser(lobby.user);
    } else {
      setError('Uh oh! Something went wrong when creating the room...');
    }
    setIsLoading(false);
    return lobby.room.id;
  };

  const joinRoomByCode = async (name: string, code: string) => {
    setIsLoading(true);
    const lobby = await joinRoomByCodeAsync({
      name,
      isHost: false,
      code,
    });
    if (lobby) {
      setRoom(lobby.room);
      setUser(lobby.user);
    } else {
      setError('Uh oh! Something went wrong when joining the room...');
    }
    setIsLoading(false);
    setHasJoinedLobby(true);
    setBody('You’re in the lobby! The host will press start when everyone is in.');
    return lobby.room.id;
  };

  return {
    body,
    room,
    user,
    isLoading,
    error,
    hasJoinedLobby,
    setBody,
    openRoom,
    joinRoomByCode,
  };
};
