import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { ee } from '../../utils/eventEmitter';
import type { Participant } from '../../types/Participant';

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
});
