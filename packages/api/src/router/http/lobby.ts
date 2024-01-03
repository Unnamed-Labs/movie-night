import { z } from 'zod';
import { prisma } from '@movie/db';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { Room } from '../../types/Room';
import type { Participant } from '../../types/Participant';
import type { Lobby } from '../../types/Lobby';
import type { Movie } from '../../types/Movie';
import type { Proposed } from '../../types/Proposed';

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
            name,
          },
        });

        const user: Participant = {
          id: pParticipant.id,
          name: pParticipant.name,
          isHost: pParticipant.isHost,
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
            })),
            user,
          ],
        };

        user.room = room;

        const lobby: Lobby = {
          user,
          room,
        };

        client.emit('addParticipant', user);

        return lobby;
      } catch (e) {
        // TODO: Improve logging for SQL error
        console.error(e);
        return null;
      }
    }),
  startGame: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .mutation(({ input }) => {
      client.emit('startGame', input.roomId);
    }),
  getProposed: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .query(async ({ input: { roomId } }) => {
      const pProposed = await prisma.proposed.findMany({
        where: {
          roomId,
        },
        select: {
          movie: {
            select: {
              id: true,
              name: true,
              description: true,
              year: true,
              date: true,
              score: true,
              location: true,
              runtime: true,
              imageSrc: true,
              imageAlt: true,
              rating: {
                select: {
                  name: true,
                },
              },
              genres: {
                select: {
                  name: true,
                },
              },
            },
          },
          participant: {
            select: {
              id: true,
              name: true,
              isHost: true,
            },
          },
        },
      });

      if (!pProposed || (pProposed && pProposed.length === 0)) {
        return null;
      }

      const proposed: Proposed[] = pProposed.map((_pProposed) => ({
        movie: {
          id: _pProposed.movie.id,
          name: _pProposed.movie.name,
          description: _pProposed.movie.description,
          year: _pProposed.movie.year,
          date: _pProposed.movie.date,
          score: _pProposed.movie.score,
          location: _pProposed.movie.location,
          runtime: _pProposed.movie.runtime,
          image: {
            src: _pProposed.movie.imageSrc,
            alt: _pProposed.movie.imageAlt,
          },
          rating: _pProposed.movie.rating.name,
          genres: _pProposed.movie.genres.map((genre) => genre.name),
        },
        user: {
          id: _pProposed.participant.id,
          name: _pProposed.participant.name,
          isHost: _pProposed.participant.isHost,
        },
      }));

      return proposed;
    }),
  getResult: publicProcedure
    .input(z.object({ roomId: z.string().cuid() }))
    .query(async ({ input: { roomId } }) => {
      const pResult = await prisma.result.findFirst({
        select: {
          movie: {
            select: {
              id: true,
              name: true,
              description: true,
              year: true,
              date: true,
              score: true,
              location: true,
              runtime: true,
              imageSrc: true,
              imageAlt: true,
              rating: {
                select: {
                  name: true,
                },
              },
              genres: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          roomId,
        },
      });

      if (!pResult) {
        return null;
      }

      const result: Movie = {
        id: pResult.movie.id,
        name: pResult.movie.name,
        description: pResult.movie.description,
        year: pResult.movie.year,
        date: pResult.movie.date,
        score: pResult.movie.score,
        location: pResult.movie.location,
        runtime: pResult.movie.runtime,
        image: {
          src: pResult.movie.imageSrc,
          alt: pResult.movie.imageAlt,
        },
        rating: pResult.movie.rating.name,
        genres: pResult.movie.genres.map((genre) => genre.name),
      };

      return result;
    }),
  submitProposed: publicProcedure
    .input(
      z.object({
        participantId: z.string().cuid(),
        movieId: z.string().cuid(),
        roomId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input: { participantId, movieId, roomId } }) => {
      try {
        await prisma.proposed.create({
          data: {
            participantId,
            movieId,
            roomId,
          },
        });

        await prisma.participant.update({
          data: {
            hasProposed: true,
          },
          where: {
            id: participantId,
          },
        });

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

        client.emit('movieProposed', roomId);

        return {
          waiting: !haveAllProposed,
          vote: haveAllProposed,
          error: false,
        };
      } catch (e) {
        console.error(e);
        return {
          waiting: false,
          vote: false,
          error: true,
        };
      }
    }),
  submitVote: publicProcedure
    .input(
      z.object({
        participantId: z.string().cuid(),
        movieId: z.string().cuid(),
        roomId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input: { participantId, movieId, roomId } }) => {
      try {
        await prisma.vote.create({
          data: {
            participantId,
            movieId,
            roomId,
          },
        });

        await prisma.participant.update({
          data: {
            hasVoted: true,
          },
          where: {
            id: participantId,
          },
        });

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

        if (haveAllVoted) {
          // find the movie with the most votes
          const pVotes = await prisma.vote.groupBy({
            by: ['movieId'],
            _count: {
              movieId: true,
            },
            where: {
              roomId,
            },
            orderBy: {
              _count: {
                movieId: 'desc',
              },
            },
          });

          await prisma.result.create({
            data: {
              movieId: pVotes[0].movieId,
              roomId,
            },
          });

          await prisma.room.update({
            data: {
              isActive: false,
            },
            where: {
              id: roomId,
            },
          });
        }

        client.emit('movieVoted', roomId);

        return {
          waiting: !haveAllVoted,
          results: haveAllVoted,
          error: false,
        };
      } catch (e) {
        console.error(e);
        return {
          waiting: false,
          results: false,
          error: true,
        };
      }
    }),
});
