import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { User } from '../../types/User';

type AddParticipantProps = {
  lobbyId: string;
  user: User;
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
        const onMovieProposed = (lobbyId: string) => {
          if (input.lobbyId === lobbyId) {
            emit.next(true);
          }
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
      return observable<{ done: boolean; hasTies: boolean }>((emit) => {
        const onMovieVoted = (lobbyId: string, hasTies: boolean) => {
          if (input.lobbyId === lobbyId) {
            emit.next({ done: true, hasTies });
          }
        };
        client.on('movieVoted', onMovieVoted);
        return () => {
          client.off('movieVoted', onMovieVoted);
        };
      });
    }),
});
