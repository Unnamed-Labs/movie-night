import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { Participant } from '../../types/Participant';
import { prisma } from '@movie/db';

export const lobby = createTRPCRouter({
  onAddParticipant: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .subscription(({ input: { roomId } }) => {
      return observable<Participant>((emit) => {
        const onAddParticipant = (data: Participant) => {
          if (roomId === data.room?.id) {
            emit.next(data);
          }
        };
        client.on('addParticipant', onAddParticipant);
        return () => {
          client.off('addParticipant', onAddParticipant);
        };
      });
    }),
  onStartGame: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onStartGame = (roomId: string) => {
          if (input.roomId === roomId) {
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
    .input(z.object({ roomId: z.string().cuid() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onMovieProposedAsync = async (roomId: string) => {
          if (input.roomId === roomId) {
            const pParticipants = await prisma.participant.findMany({
              select: {
                id: true,
                hasProposed: true,
              },
              where: {
                roomId,
              },
            });

            const haveAllProposed = pParticipants.every((pParticipant) => pParticipant.hasProposed);

            emit.next(haveAllProposed);
          }
        };
        const onMovieProposed = (roomId: string) => {
          void onMovieProposedAsync(roomId);
        };
        client.on('movieProposed', onMovieProposed);
        return () => {
          client.off('movieProposed', onMovieProposed);
        };
      });
    }),
  onMovieVoted: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onMovieVotedAsync = async (roomId: string) => {
          if (input.roomId === roomId) {
            const pParticipants = await prisma.participant.findMany({
              select: {
                id: true,
                hasVoted: true,
              },
              where: {
                roomId,
              },
            });

            const haveAllVoted = pParticipants.every((pParticipant) => pParticipant.hasVoted);

            emit.next(haveAllVoted);
          }
        };
        const onMovieVoted = (roomId: string) => {
          void onMovieVotedAsync(roomId);
        };
        client.on('movieVoted', onMovieVoted);
        return () => {
          client.off('movieVoted', onMovieVoted);
        };
      });
    }),
});
