import { z } from 'zod';
import { prisma } from '@movie/db';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import type { Room } from '../../types/Room';
import type { Participant } from '../../types/Participant';

export const participant = createTRPCRouter({
  joinRoomByCode: publicProcedure
    .input(z.object({ name: z.string(), isHost: z.boolean(), code: z.string().length(4) }))
    .mutation(async ({ input: { name, isHost, code } }) => {
      const pRoom = await prisma.room.findFirst({
        where: {
          code,
          isActive: true,
        },
        select: {
          id: true,
          code: true,
          amount: true,
        },
      });

      if (!pRoom) {
        return null;
      }

      const pParticipant = await prisma.participant.create({
        data: {
          roomId: pRoom.id,
          isHost,
          isGuest: !isHost,
          name,
        },
      });

      const room: Room = {
        id: pRoom.id,
        code: pRoom.code,
        amount: pRoom.amount,
      };

      const participant: Participant = {
        id: pParticipant.id,
        name: pParticipant.name,
        isHost: pParticipant.isHost,
        isGuest: pParticipant.isGuest,
        room,
      };

      return participant;
    }),
});
