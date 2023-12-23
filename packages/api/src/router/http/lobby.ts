import { z } from 'zod';
import { prisma } from '@movie/db';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { ee } from '../../utils/eventEmitter';
import type { Room } from '../../types/Room';
import type { Participant } from '../../types/Participant';
import type { Lobby } from '../../types/Lobby';

export const lobby = createTRPCRouter({
  open: publicProcedure
    .input(z.object({ userId: z.string().cuid().optional(), name: z.string().min(1) }))
    .mutation(async ({ input: { userId, name } }) => {
      // TODO: how to better do a valid room code lookup? redis? find next valid room code in db table?
      try {
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

        const pNewRoom = await prisma.room.create({
          data: {
            code: validRoomCode,
            isActive: true,
          },
          select: {
            id: true,
            code: true,
            amount: true,
            participants: true,
          },
        });

        const pUser = await prisma.participant.create({
          data: {
            name,
            isHost: true,
            isGuest: false,
            roomId: pNewRoom.id,
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
        });

        const user: Participant = {
          id: pUser.id,
          name: pUser.name,
          isHost: pUser.isHost,
          isGuest: pUser.isGuest,
        };

        const room: Room = {
          id: pNewRoom.id,
          code: pNewRoom.code,
          amount: pNewRoom.amount,
          participants: [
            ...pNewRoom.participants.map((participant) => ({
              id: participant.id,
              name: participant.name,
              isHost: participant.isHost,
              isGuest: participant.isGuest,
            })),
            user,
          ],
        };

        const lobby: Lobby = {
          user,
          room,
        };

        return lobby;
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
      try {
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
          // TODO: Improve error for room not found
          return null;
        }

        if (pRoom.participants.length >= 8) {
          // TODO: Improve error for room full
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

        const user: Participant = {
          id: pParticipant.id,
          name: pParticipant.name,
          isHost: pParticipant.isHost,
          isGuest: pParticipant.isGuest,
        };

        const room: Room = {
          id: pRoom.id,
          code: pRoom.code,
          amount: pRoom.amount,
          participants: [
            ...pRoom.participants.map((participant) => ({
              id: participant.id,
              name: participant.name,
              isHost: participant.isHost,
              isGuest: participant.isGuest,
            })),
            user,
          ],
        };

        user.room = room;

        const lobby: Lobby = {
          user,
          room,
        };

        ee.emit('addParticipant', user);

        return lobby;
      } catch (e) {
        // TODO: Improve logging for SQL error
        console.error(e);
        return null;
      }
    }),
});
