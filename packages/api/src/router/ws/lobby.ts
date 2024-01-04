import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { User } from '../../types/User';
import type { Lobby } from '../../types/Lobby';

type AddParticipantProps = {
  lobbyId: string;
  user: User;
};

const getLobby = async (lobbyId: string) => {
  const lobbyFromRedis = await client.get(lobbyId);

  if (!lobbyFromRedis) {
    // TODO: Improve error for room not found
    return null;
  }

  const lobby = JSON.parse(lobbyFromRedis) as Lobby;

  return lobby;
};

export const lobby = createTRPCRouter({
  onAddParticipant: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .subscription(({ input: { lobbyId } }) => {
      return observable<User>((emit) => {
        const onAddParticipant = (data: AddParticipantProps) => {
          if (lobbyId === data.lobbyId) {
            emit.next(data.user);
          }
        };
        client.on('addParticipant', onAddParticipant);
        return () => {
          client.off('addParticipant', onAddParticipant);
        };
      });
    }),
  onStartGame: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onStartGame = (lobbyId: string) => {
          if (input.lobbyId === lobbyId) {
            emit.next(true);
          }
        };
        client.on('startGame', onStartGame);
        return () => {
          client.off('startGame', onStartGame);
        };
      });
    }),
  onMovieProposed: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onMovieProposedAsync = async (lobbyId: string) => {
          if (input.lobbyId === lobbyId) {
            const lobby = await getLobby(lobbyId);

            if (!lobby) {
              emit.next(false);
              return;
            }

            const haveAllProposed = lobby.proposed.length === lobby.participants.length;

            emit.next(haveAllProposed);
          }
        };
        const onMovieProposed = (lobbyId: string) => {
          void onMovieProposedAsync(lobbyId);
        };
        client.on('movieProposed', onMovieProposed);
        return () => {
          client.off('movieProposed', onMovieProposed);
        };
      });
    }),
  onMovieVoted: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onMovieVotedAsync = async (lobbyId: string) => {
          if (input.lobbyId === lobbyId) {
            const lobby = await getLobby(lobbyId);

            if (!lobby) {
              emit.next(false);
              return;
            }

            const haveAllVoted = lobby.votes.length === lobby.participants.length;

            emit.next(haveAllVoted);
          }
        };
        const onMovieVoted = (lobbyId: string) => {
          void onMovieVotedAsync(lobbyId);
        };
        client.on('movieVoted', onMovieVoted);
        return () => {
          client.off('movieVoted', onMovieVoted);
        };
      });
    }),
});
