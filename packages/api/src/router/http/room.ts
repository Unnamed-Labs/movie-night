import { z } from 'zod';
import { prisma } from '@movie/db';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import type { Room } from '../../types/Room';

export const room = createTRPCRouter({
  open: publicProcedure.mutation(async () => {
    const pRoom = await prisma.room.create({
      data: {
        code: 'ASDF',
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        amount: true,
      },
    });

    const room: Room = {
      id: pRoom.id,
      code: pRoom.code,
      amount: pRoom.amount,
    };

    return room;
  }),
  closeById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input: { id } }) => {
      await prisma.room.update({
        data: {
          isActive: false,
        },
        where: {
          id,
        },
      });
    }),
  findByParticipantName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input: { name } }) => {
      const pRoom = await prisma.room.findFirst({
        where: {
          participants: {
            some: {
              name,
            },
          },
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

      const room: Room = {
        id: pRoom.id,
        code: pRoom.code,
        amount: pRoom.amount,
      };

      return room;
    }),
});
