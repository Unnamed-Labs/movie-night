import { useState } from 'react';
import { useLobbyStore } from '~/stores/lobby';
import { api } from '~/utils/api';

type UseLobbyOptions = {
  enableParticipantUpdates?: boolean;
};

export const useLobby = ({ enableParticipantUpdates }: UseLobbyOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
  const { room, user, setRoom, setUser, addParticipant } = useLobbyStore((state) => ({
    room: state.room,
    user: state.user,
    setRoom: state.setRoom,
    setUser: state.setUser,
    addParticipant: state.addParticipant,
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
    return lobby.room.id;
  };

  if (enableParticipantUpdates) {
    api.lobbyWs.onAddParticipant.useSubscription(
      { roomId: room.id },
      {
        onData(data) {
          addParticipant(data);
        },
      },
    );
  }

  return {
    room,
    user,
    isLoading,
    error,
    hasJoinedLobby,
    openRoom,
    joinRoomByCode,
  };
};
