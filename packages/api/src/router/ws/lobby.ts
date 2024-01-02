import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { ee } from '../../utils/eventEmitter';
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
        ee.on('addParticipant', onAddParticipant);
        return () => {
          ee.off('addParticipant', onAddParticipant);
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
        ee.on('startGame', onStartGame);
        return () => {
          ee.off('startGame', onStartGame);
        };
      });
    }),
  onMovieProposed: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onMovieProposed = async (roomId: string) => {
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
        ee.on('movieProposed', onMovieProposed);
        return () => {
          ee.off('movieProposed', onMovieProposed);
        };
      });
    }),
  onMovieVoted: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .subscription(({ input }) => {
      return observable<boolean>((emit) => {
        const onMovieVoted = async (roomId: string) => {
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
        ee.on('movieVoted', onMovieVoted);
        return () => {
          ee.off('movieVoted', onMovieVoted);
        };
      });
    }),
});
