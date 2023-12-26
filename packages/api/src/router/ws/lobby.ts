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
          console.log('\n\n\n=== input.roomId ===\n', input.roomId, '\n\n\n');
          console.log('\n\n\n=== roomId ===\n', roomId, '\n\n\n');
          if (input.roomId === roomId) {
            const pParticipants = await prisma.participant.findMany({
              select: {
                id: true,
              },
              where: {
                roomId,
              },
            });

            const pParticipantsProposed = await prisma.participant.findMany({
              select: {
                id: true,
              },
              where: {
                roomId,
                hasProposed: true,
              },
            });

            console.log(
              '\n\n\n=== are all participants locked in? ===\n',
              pParticipants.length === pParticipantsProposed.length,
              '\n\n\n',
            );

            emit.next(pParticipants.length === pParticipantsProposed.length);
          }
        };
        ee.on('movieProposed', onMovieProposed);
        return () => {
          ee.off('movieProposed', onMovieProposed);
        };
      });
    }),
});
