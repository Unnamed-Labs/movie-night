import { useState } from 'react';
import type { Movie } from '@movie/api';
import { useLobbyStore } from '~/stores/lobby';
import { api } from '~/utils/api';

type UseLobbyOptions = {
  enableParticipantUpdates?: boolean;
};

export const useLobby = ({ enableParticipantUpdates }: UseLobbyOptions = {}) => {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const { lobby, user, setLobby, setUser, addParticipant } = useLobbyStore((state) => ({
    lobby: state.lobby,
    user: state.user,
    setLobby: state.setLobby,
    setUser: state.setUser,
    addParticipant: state.addParticipant,
  }));

  const { mutateAsync: openRoomAsync } = api.lobby.open.useMutation();
  const { mutateAsync: joinByCodeAsync } = api.lobby.joinByCode.useMutation();
  const { mutateAsync: startGameByIdAsync } = api.lobby.startGameById.useMutation();
  const { mutateAsync: submitProposedMovieByIdAsync } =
    api.lobby.submitProposedMovieById.useMutation();
  const { mutateAsync: submitVoteForMovieByIdAsync } =
    api.lobby.submitVoteForMovieById.useMutation();

  const openRoom = async (name: string) => {
    setLoading('Opening room...');
    const res = await openRoomAsync({ name });
    if (res) {
      setLobby(res.lobby);
      setUser(res.user);
    } else {
      setError('Uh oh! Something went wrong when creating the room...');
    }
    setLoading('');
    return res.lobby.id;
  };

  const joinByCode = async (name: string, code: string) => {
    setLoading('Joining room...');
    const res = await joinByCodeAsync({
      name,
      isHost: false,
      code,
    });
    if (res) {
      setLobby(res.lobby);
      setUser(res.user);
    } else {
      setError('Uh oh! Something went wrong when joining the room...');
    }
    setLoading('');
    return res.lobby?.id;
  };

  const startGameById = async () => {
    setLoading('Starting game...');
    await startGameByIdAsync({ lobbyId: lobby.id });
    setLoading('');
  };

  const submitProposedMovieById = async (movie: Movie) => {
    setLoading('Submitting selected movies...');
    const res = await submitProposedMovieByIdAsync({
      userId: user.id,
      lobbyId: lobby.id,
      movie,
    });
    if (res.error) {
      setError('Uh oh! Something went wrong when submitting the selected movies...');
    }
    setLoading('');
    return res;
  };

  const submitVoteForMovieById = async (movie: Movie) => {
    setLoading('Submitting vote...');
    const res = await submitVoteForMovieByIdAsync({
      userId: user.id,
      lobbyId: lobby.id,
      movie,
    });
    if (res.error) {
      setError('Uh oh! Something went wrong when submitting the selected movies...');
    }
    setLoading('');
    return res;
  };

  if (lobby && enableParticipantUpdates) {
    api.lobbyWs.onAddParticipant.useSubscription(
      { lobbyId: lobby.id },
      {
        onData(data) {
          addParticipant(data);
        },
      },
    );
  }

  return {
    lobby,
    user,
    loading,
    error,
    openRoom,
    joinByCode,
    startGameById,
    submitProposedMovieById,
    submitVoteForMovieById,
  };
};
