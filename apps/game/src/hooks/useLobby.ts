import { useState } from 'react';
import { useLobbyStore } from '~/stores/lobby';
import { api } from '~/utils/api';

type UseLobbyOptions = {
  enableParticipantUpdates?: boolean;
};

export const useLobby = ({ enableParticipantUpdates }: UseLobbyOptions = {}) => {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const { room, user, setRoom, setUser, addParticipant } = useLobbyStore((state) => ({
    room: state.room,
    user: state.user,
    setRoom: state.setRoom,
    setUser: state.setUser,
    addParticipant: state.addParticipant,
  }));

  const { mutateAsync: openRoomAsync } = api.lobby.open.useMutation();
  const { mutateAsync: joinRoomByCodeAsync } = api.lobby.joinRoomByCode.useMutation();
  const { mutateAsync: startGameAsync } = api.lobby.startGame.useMutation();
  const { mutateAsync: submitProposedAsync } = api.lobby.submitProposed.useMutation();
  const { mutateAsync: submitVoteAsync } = api.lobby.submitVote.useMutation();

  const openRoom = async (name: string) => {
    setLoading('Opening room...');
    const lobby = await openRoomAsync({ name });
    if (lobby) {
      setRoom(lobby.room);
      setUser(lobby.user);
    } else {
      setError('Uh oh! Something went wrong when creating the room...');
    }
    setLoading('');
    return lobby.room.id;
  };

  const joinRoomByCode = async (name: string, code: string) => {
    setLoading('Joining room...');
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
    setLoading('');
    return lobby.room.id;
  };

  const startGame = async () => {
    setLoading('Starting game...');
    await startGameAsync({ roomId: room.id });
    setLoading('');
  };

  const submitProposed = async (movieId: string) => {
    setLoading('Submitting selected movies...');
    const res = await submitProposedAsync({
      participantId: user.id,
      roomId: room.id,
      movieId,
    });
    if (res.error) {
      setError('Uh oh! Something went wrong when submitting the selected movies...');
    }
    setLoading('');
    return res;
  };

  const submitVote = async (movieId: string) => {
    setLoading('Submitting vote...');
    const res = await submitVoteAsync({
      participantId: user.id,
      roomId: room.id,
      movieId,
    });
    if (res.error) {
      setError('Uh oh! Something went wrong when submitting the selected movies...');
    }
    setLoading('');
    return res;
  };

  if (room && enableParticipantUpdates) {
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
    loading,
    error,
    openRoom,
    joinRoomByCode,
    startGame,
    submitProposed,
    submitVote,
  };
};
