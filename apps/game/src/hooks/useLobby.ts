import { useState } from 'react';
import { useLobbyStore } from '~/stores/lobby';
import { api } from '~/utils/api';

export const useLobby = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
  const { body, room, setRoom, setBody } = useLobbyStore((state) => ({
    body: state.body,
    room: state.room,
    setBody: state.setBody,
    setRoom: state.setRoom,
  }));

  const { mutateAsync: openRoomAsync } = api.lobby.open.useMutation();
  const { mutateAsync: joinRoomByCodeAsync } = api.lobby.joinRoomByCode.useMutation();

  const openRoom = async (name: string) => {
    setIsLoading(true);
    const newRoom = await openRoomAsync({ name });
    if (newRoom) {
      setRoom(newRoom);
    } else {
      setError('Uh oh! Something went wrong when creating the room...');
    }
    setIsLoading(false);
    return newRoom;
  };

  const joinRoomByCode = async (name: string, code: string) => {
    setIsLoading(true);
    const room = await joinRoomByCodeAsync({
      name,
      isHost: false,
      code,
    });
    if (room) {
      setRoom(room);
    } else {
      setError('Uh oh! Something went wrong when joining the room...');
    }
    setIsLoading(false);
    setHasJoinedLobby(true);
    setBody('You’re in the lobby! The host will press start when everyone is in.');
    return room;
  };

  return {
    body,
    room,
    isLoading,
    error,
    hasJoinedLobby,
    setBody,
    openRoom,
    joinRoomByCode,
  };
};
