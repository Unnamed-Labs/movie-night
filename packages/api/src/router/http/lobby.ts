import { z } from 'zod';
import { prisma } from '@movie/db';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import type { Room } from '../../types/Room';
import type { Participant } from '../../types/Participant';

export const lobby = createTRPCRouter({
  open: publicProcedure
    .input(z.object({ userId: z.string().cuid().optional(), name: z.string().min(1) }))
    .mutation(async ({ input: { userId, name } }): Promise<Room | null> => {
      // TODO: how to better do a valid room code lookup? redis? find next valid room code in db table?
      let validRoomCode = null;
      while (!validRoomCode) {
        const randomCode = ('0000' + Math.floor(Math.random() * 9999).toString()).slice(-4);
        const pRoom = await prisma.room.findFirst({
          where: {
            code: randomCode,
            isActive: true,
          },
        });

        if (!pRoom) {
          validRoomCode = randomCode;
        }
      }

      try {
        const pNewRoom = await prisma.room.create({
          data: {
            code: validRoomCode,
            isActive: true,
            participants: {
              create: {
                name,
                isHost: true,
                isGuest: false,
                ...(userId
                  ? {
                      users: {
                        connect: {
                          id: userId,
                        },
                      },
                    }
                  : {}),
              },
            },
          },
          select: {
            id: true,
            code: true,
            amount: true,
            participants: true,
          },
        });

        const room: Room = {
          id: pNewRoom.id,
          code: pNewRoom.code,
          amount: pNewRoom.amount,
          participants: pNewRoom.participants.map((participant) => ({
            id: participant.id,
            name: participant.name,
            isHost: participant.isHost,
            isGuest: participant.isGuest,
          })),
        };

        return room;
      } catch (e) {
        // TODO: Improve log statement here for SQL errors
        console.error(e);
        return null;
      }
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
  joinRoomByCode: publicProcedure
    .input(z.object({ name: z.string(), isHost: z.boolean(), code: z.string().length(4) }))
    .mutation(async ({ input: { name, isHost, code } }) => {
      // TODO: refactor to use createOrConnect on room prop of participant?
      // TODO: SQL error handling
      // TODO: add error for room not found
      // TODO: add error for room full
      const pRoom = await prisma.room.findFirst({
        where: {
          code,
          isActive: true,
        },
        select: {
          id: true,
          code: true,
          amount: true,
          participants: true,
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

      const participant: Participant = {
        id: pParticipant.id,
        name: pParticipant.name,
        isHost: pParticipant.isHost,
        isGuest: pParticipant.isGuest,
      };

      const room: Room = {
        id: pRoom.id,
        code: pRoom.code,
        amount: pRoom.amount,
        participants: [...pRoom.participants, participant],
      };

      return room;
    }),
  // *** NOT READY YET ***
  // findByParticipantName: publicProcedure
  //   .input(z.object({ name: z.string() }))
  //   .query(async ({ input: { name } }) => {
  //     const pRoom = await prisma.room.findFirst({
  //       where: {
  //         participants: {
  //           some: {
  //             name,
  //           },
  //         },
  //         isActive: true,
  //       },
  //       select: {
  //         id: true,
  //         code: true,
  //         amount: true,
  //       },
  //     });

  //     if (!pRoom) {
  //       return null;
  //     }

  //     const room: Room = {
  //       id: pRoom.id,
  //       code: pRoom.code,
  //       amount: pRoom.amount,
  //     };

  //     return room;
  //   }),
});
