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
  const { lobby, user, previousRoute, setLobby, setUser, addParticipant, setPreviousRoute } =
    useLobbyStore((state) => ({
      lobby: state.lobby,
      user: state.user,
      previousRoute: state.previousRoute,
      setLobby: state.setLobby,
      setUser: state.setUser,
      addParticipant: state.addParticipant,
      setPreviousRoute: state.setPreviousRoute,
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
      setError("we couldn't create a lobby for you...");
    }
    setLoading('');
    return res?.lobby?.id;
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
      setError("the lobby you tried to find doesn't exist...");
    }
    setLoading('');
    return res?.lobby?.id;
  };

  const startGameById = async () => {
    setLoading('Starting game...');
    if (lobby) {
      await startGameByIdAsync({ lobbyId: lobby.id });
    }
    setLoading('');
  };

  const submitProposedMovieById = async (movie: Movie) => {
    setLoading('Submitting selected movies...');
    if (user && lobby) {
      const res = await submitProposedMovieByIdAsync({
        userId: user.id,
        lobbyId: lobby.id,
        movie,
      });
      if (res.error) {
        setError('an error occurred submitting your suggestion...');
      }
      setLoading('');
      return res;
    } else {
      setError('we could not submit your suggestion...');
      setLoading('');
      return {
        waiting: false,
        vote: false,
        error: true,
      };
    }
  };

  const submitVoteForMovieById = async (movie: Movie) => {
    setLoading('Submitting vote...');
    if (user && lobby) {
      const res = await submitVoteForMovieByIdAsync({
        userId: user.id,
        lobbyId: lobby.id,
        movie,
      });
      if (res.error) {
        setError('an error occurred submitting your vote...');
      }
      setLoading('');
      return res;
    } else {
      setError('we could not submit your vote...');
      setLoading('');
      return {
        waiting: false,
        results: false,
        tied: false,
        error: true,
      };
    }
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
    previousRoute,
    openRoom,
    joinByCode,
    startGameById,
    submitProposedMovieById,
    submitVoteForMovieById,
    setPreviousRoute,
    setError,
  };
};
