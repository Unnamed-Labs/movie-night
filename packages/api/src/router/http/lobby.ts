import { z } from 'zod';
import { prisma } from '@movie/db';
import { createId } from '@paralleldrive/cuid2';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { Participant } from '../../types/Participant';
import type { Lobby } from '../../types/Lobby';
import type { Movie } from '../../types/Movie';
import type { Proposed } from '../../types/Proposed';

const getLobby = async (code: string) => {
  const lobbyFromRedis = await client.get(code);

  if (!lobbyFromRedis) {
    // TODO: Improve error for room not found
    return null;
  }

  const lobby = JSON.parse(lobbyFromRedis) as Lobby;

  return lobby;
};

export const lobby = createTRPCRouter({
  open: publicProcedure
    .input(z.object({ userId: z.string().cuid().optional(), name: z.string().min(1) }))
    .mutation(async ({ input: { userId, name } }) => {
      // TODO: how to better do a valid room code lookup? redis? find next valid room code in db table?
      try {
        const code = ('0000' + Math.floor(Math.random() * 9999).toString()).slice(-4);

        const user: Participant = {
          id: createId(),
          name: name,
          isHost: true,
          userId,
        };

        const lobby: Lobby = {
          id: createId(),
          amount: 8,
          code,
          participants: [user],
          proposed: [],
          votes: [],
        };

        await client.set(code, JSON.stringify(lobby));

        return {
          user,
          lobby,
        };
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
  joinByCode: publicProcedure
    .input(z.object({ name: z.string(), isHost: z.boolean(), code: z.string().length(4) }))
    .mutation(async ({ input: { name, isHost, code } }) => {
      try {
        const lobby = await getLobby(code);

        if (!lobby) {
          return null;
        }

        if (lobby.participants.length >= 8) {
          // TODO: Improve error for room full
          return null;
        }

        const user: Participant = {
          id: createId(),
          name,
          isHost,
        };

        const newLobby: Lobby = {
          ...lobby,
          participants: [...lobby.participants, user],
        };

        await client.set(code, JSON.stringify(newLobby));

        client.emit('addParticipant', newLobby);

        return newLobby;
      } catch (e) {
        // TODO: Improve logging for SQL error
        console.error(e);
        return null;
      }
    }),
  startGameByCode: publicProcedure
    .input(z.object({ code: z.string().length(4) }))
    .mutation(({ input: { code } }) => {
      client.emit('startGame', code);
    }),
  getProposedByCode: publicProcedure
    .input(z.object({ code: z.string().length(4) }))
    .query(async ({ input: { code } }) => {
      const lobby = await getLobby(code);

      if (!lobby) {
        return null;
      }

      if (lobby.proposed.length === 0) {
        return null;
      }

      return lobby.proposed;
    }),
  getResultByCode: publicProcedure
    .input(z.object({ code: z.string().length(4) }))
    .query(async ({ input: { code } }) => {
      const lobby = await getLobby(code);

      if (!lobby) {
        return null;
      }

      return lobby.result;
    }),
  submitProposedMovieByCode: publicProcedure
    .input(
      z.object({
        participantId: z.string().cuid2(),
        movie: z.object({
          id: z.string().cuid2(),
          description: z.string(),
          date: z.string(),
          name: z.string(),
          location: z.string(),
          rating: z.string(),
          runtime: z.string(),
          score: z.number(),
          year: z.string(),
          genres: z.array(z.string()),
          image: z.object({
            src: z.string(),
            alt: z.string(),
          }),
        }),
        code: z.string().length(4),
      }),
    )
    .mutation(async ({ input: { participantId, movie, code } }) => {
      try {
        const lobby = await getLobby(code);

        if (!lobby) {
          return null;
        }

        const participant = lobby.participants.find(
          (participant) => participant.id === participantId,
        );

        if (!participant) {
          return null;
        }

        const proposed: Proposed = {
          movie,
          user: participant,
        };

        const newLobby = {
          ...lobby,
          proposed: [...lobby.proposed, proposed],
        };

        const haveAllProposed = pParticipants.every((pParticipant) => pParticipant.hasProposed);

        client.emit('movieProposed', lobby.id);

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
