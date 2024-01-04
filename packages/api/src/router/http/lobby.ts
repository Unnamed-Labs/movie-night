import { z } from 'zod';
import { prisma } from '@movie/db';
import { createId } from '@paralleldrive/cuid2';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { User } from '../../types/User';
import type { Lobby } from '../../types/Lobby';
import type { Movie } from '../../types/Movie';
import type { MovieUser } from '../../types/MovieUser';

type VoteMap = {
  [key: string]: {
    count: number;
    movie: Movie;
  };
};

const getLobby = async (lobbyId: string) => {
  const lobbyFromRedis = await client.get(lobbyId);

  if (!lobbyFromRedis) {
    // TODO: Improve error for room not found
    return null;
  }

  const lobby = JSON.parse(lobbyFromRedis) as Lobby;

  return lobby;
};

export const lobby = createTRPCRouter({
  open: publicProcedure
    .input(z.object({ accountId: z.string().cuid().optional(), name: z.string().min(1) }))
    .mutation(async ({ input: { accountId, name } }) => {
      // TODO: how to better do a valid room code lookup? redis? find next valid room code in db table?
      try {
        const code = ('0000' + Math.floor(Math.random() * 9999).toString()).slice(-4);

        const user: User = {
          id: createId(),
          name: name,
          isHost: true,
          accountId,
        };

        const lobby: Lobby = {
          id: createId(),
          amount: 8,
          code,
          participants: [user],
          proposed: [],
          votes: [],
        };

        await prisma.room.create({
          data: {
            id: lobby.id,
            code,
            isActive: true,
          },
        });

        await client.set(lobby.id, JSON.stringify(lobby));

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
        const pRoom = await prisma.room.findFirst({
          select: {
            id: true,
          },
          where: {
            code,
            isActive: true,
          },
        });

        if (!pRoom) {
          return null;
        }

        const lobby = await getLobby(pRoom.id);

        if (!lobby) {
          return null;
        }

        if (lobby.participants.length >= 8) {
          // TODO: Improve error for room full
          return null;
        }

        const user: User = {
          id: createId(),
          name,
          isHost,
        };

        const newLobby: Lobby = {
          ...lobby,
          participants: [...lobby.participants, user],
        };

        await client.set(newLobby.id, JSON.stringify(newLobby));

        client.emit('addParticipant', {
          lobbyId: newLobby.id,
          user,
        });

        return {
          lobby: newLobby,
          user,
        };
      } catch (e) {
        // TODO: Improve logging for SQL error
        console.error(e);
        return null;
      }
    }),
  startGameById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .mutation(({ input: { lobbyId } }) => {
      client.emit('startGame', lobbyId);
    }),
  getProposedById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId } }) => {
      const lobby = await getLobby(lobbyId);

      if (!lobby) {
        return null;
      }

      return lobby.proposed;
    }),
  getResultById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId } }) => {
      const result = await prisma.result.findFirst({
        where: {
          roomId: lobbyId,
        },
        select: {
          movie: {
            select: {
              id: true,
              name: true,
              description: true,
              location: true,
              date: true,
              score: true,
              year: true,
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
      });

      if (!result) {
        return null;
      }

      const movie: Movie = {
        id: result.movie.id,
        name: result.movie.name,
        description: result.movie.description,
        location: result.movie.location,
        date: result.movie.date,
        score: result.movie.score,
        year: result.movie.year,
        runtime: result.movie.runtime,
        image: {
          src: result.movie.imageSrc,
          alt: result.movie.imageAlt,
        },
        rating: result.movie.rating.name,
        genres: result.movie.genres.map((genre) => genre.name),
      };

      return movie;
    }),
  submitProposedMovieById: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid2(),
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
        lobbyId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ input: { userId, movie, lobbyId } }) => {
      try {
        const lobby = await getLobby(lobbyId);

        if (!lobby) {
          return null;
        }

        const user = lobby.participants.find((participant) => participant.id === userId);

        if (!user) {
          return null;
        }

        const hasParticipantProposed = !!lobby.proposed.find((p) => p.user.id === userId);

        if (hasParticipantProposed) {
          return null;
        }

        const proposed: MovieUser = {
          movie,
          user,
        };

        const newLobby = {
          ...lobby,
          proposed: [...lobby.proposed, proposed],
        };

        await client.set(lobbyId, JSON.stringify(newLobby));

        const haveAllProposed = newLobby.proposed.length === newLobby.participants.length;

        client.emit('movieProposed', lobbyId);

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
  submitVoteForMovieById: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid2(),
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
        lobbyId: z.string().cuid2(),
      }),
    )
    .mutation(async ({ input: { userId, movie, lobbyId } }) => {
      try {
        const lobby = await getLobby(lobbyId);

        if (!lobby) {
          return null;
        }

        const user = lobby.participants.find((participant) => participant.id === userId);

        if (!user) {
          return null;
        }

        const hasUserVoted = !!lobby.votes.find((vote) => vote.user.id === userId);

        if (hasUserVoted) {
          return null;
        }

        const vote: MovieUser = {
          movie,
          user,
        };

        const newLobby = {
          ...lobby,
          votes: [...lobby.votes, vote],
        };

        await client.set(lobbyId, JSON.stringify(newLobby));

        const haveAllVoted = newLobby.votes.length === newLobby.participants.length;

        if (haveAllVoted) {
          const voteMap = newLobby.votes.reduce((prev: VoteMap, curr, idx) => {
            const exists = !!prev[curr.movie.id];
            if (!exists) {
              return {
                ...prev,
                [curr.movie.id]: {
                  idx,
                  count: 0,
                  movie: curr.movie,
                },
              };
            }
            return {
              ...prev,
              [curr.movie.id]: {
                ...prev[curr.movie.id],
                count: prev[curr.movie.id].count + 1,
              },
            };
          }, {});

          const keys = Object.keys(voteMap);
          let result: Movie | null = null;
          let maxCount = 0;

          for (const key of keys) {
            const item = voteMap[key];
            if (item.count >= maxCount) {
              result = item.movie;
              maxCount = item.count;
            }
          }

          const newLobbyWithResult = {
            ...newLobby,
            result,
          };

          await client.del(lobbyId);

          const pRoom = await prisma.room.update({
            data: {
              isActive: false,
            },
            where: {
              id: newLobbyWithResult.id,
            },
          });

          await prisma.result.create({
            data: {
              movieId: (result as Movie).id,
              roomId: pRoom.id,
            },
          });
        }

        client.emit('movieVoted', lobbyId);

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
