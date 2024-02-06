import { z } from 'zod';
import { prisma } from '@movie/db';
import { createId } from '@paralleldrive/cuid2';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { User } from '../../types/User';
import type { Lobby } from '../../types/Lobby';
import type { Movie } from '../../types/Movie';

const zodMovieObject = z.object({
  id: z.string().cuid2(),
  description: z.string(),
  date: z.string(),
  title: z.string(),
  location: z.string(),
  rating: z.string(),
  runtime: z.string(),
  score: z.number(),
  genres: z.array(z.string()),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
});

type ZodMovie = z.infer<typeof zodMovieObject>;

const getLobby = async (lobbyId: string) => {
  const lobbyFromRedis = await client.get(lobbyId);

  if (!lobbyFromRedis) {
    // TODO: Improve error for room not found
    return null;
  }

  const lobby = JSON.parse(lobbyFromRedis) as Lobby;

  return lobby;
};

const addMovieUserToLobby = (
  lobby: Lobby,
  movie: ZodMovie,
  user: User,
  key: 'proposed' | 'votes',
) => {
  const itemIdx = lobby[key].findIndex((item) => item.movie.id === movie.id);
  let newLobby: Lobby;

  if (itemIdx > -1) {
    const item = lobby[key][itemIdx];

    const updatedItem = {
      ...item,
      users: [...item.users, user],
    };

    const newList = lobby[key].slice();
    newList.splice(itemIdx, 1, updatedItem);

    newLobby = {
      ...lobby,
      [key]: newList,
    };
  } else {
    const newItem = {
      movie,
      users: [user],
    };

    newLobby = {
      ...lobby,
      [key]: [...lobby[key], newItem],
    };
  }

  return newLobby;
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

        await prisma.lobby.create({
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
      await prisma.lobby.update({
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
        const pRoom = await prisma.lobby.findFirst({
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
    .input(z.object({ lobbyId: z.string().cuid2(), userId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId, userId } }) => {
      const lobby = await getLobby(lobbyId);

      if (!lobby) {
        return null;
      }

      const movieExists: { [key: string]: boolean } = {};
      const userSuggestion = lobby.proposed.find((p) => p.users.find((u) => u.id === userId));

      if (!userSuggestion) {
        return null;
      }

      const proposed = lobby.proposed.filter((p) => {
        if (!movieExists[p.movie.id] && p.movie.title !== userSuggestion.movie.title) {
          movieExists[p.movie.id] = true;
          return true;
        }
        return false;
      });

      return proposed;
    }),
  getResultById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId } }) => {
      const result = await prisma.lobby.findFirst({
        select: {
          movie: {
            select: {
              id: true,
              title: true,
              description: true,
              location: true,
              date: true,
              score: true,
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
          id: lobbyId,
        },
      });

      if (!result) {
        return null;
      }

      if (!result.movie) {
        return null;
      }

      const movie: Movie = {
        id: result.movie.id,
        title: result.movie.title,
        description: result.movie.description,
        location: result.movie.location,
        date: result.movie.date,
        score: result.movie.score,
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
          title: z.string(),
          location: z.string(),
          rating: z.string(),
          runtime: z.string(),
          score: z.number(),
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
          return {
            waiting: false,
            vote: false,
            error: true,
          };
        }

        const user = lobby.participants.find((participant) => participant.id === userId);

        if (!user) {
          return {
            waiting: false,
            vote: false,
            error: true,
          };
        }

        const hasParticipantProposed = !!lobby.proposed.find(
          (p) => !!p.users.find((u) => u.id === userId),
        );

        if (hasParticipantProposed) {
          return {
            waiting: false,
            vote: false,
            error: true,
          };
        }

        const newLobby = addMovieUserToLobby(lobby, movie, user, 'proposed');

        await client.set(lobbyId, JSON.stringify(newLobby));

        const proposedCount = newLobby.proposed.reduce((prev, curr) => prev + curr.users.length, 0);
        const haveAllProposed = proposedCount === newLobby.participants.length;

        if (haveAllProposed) {
          client.emit('movieProposed', lobbyId);
        }

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
          title: z.string(),
          location: z.string(),
          rating: z.string(),
          runtime: z.string(),
          score: z.number(),
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
          return {
            waiting: false,
            results: false,
            error: true,
          };
        }

        const user = lobby.participants.find((participant) => participant.id === userId);

        if (!user) {
          return {
            waiting: false,
            results: false,
            error: true,
          };
        }

        const hasUserVoted = !!lobby.votes.find(
          (vote) => !!vote.users.find((u) => u.id === userId),
        );

        if (hasUserVoted) {
          return {
            waiting: false,
            results: false,
            error: true,
          };
        }

        const newLobby = addMovieUserToLobby(lobby, movie, user, 'votes');

        await client.set(lobbyId, JSON.stringify(newLobby));

        const votedCount = newLobby.votes.reduce((prev, curr) => prev + curr.users.length, 0);
        const haveAllVoted = votedCount === newLobby.participants.length;

        if (haveAllVoted) {
          let result: Movie | null = null;
          let maxVotes = 0;

          for (const vote of newLobby.votes) {
            if (vote.users.length >= maxVotes) {
              result = vote.movie;
              maxVotes = vote.users.length;
            }
          }

          const newLobbyWithResult = {
            ...newLobby,
            result: result as Movie,
          };

          await client.del(lobbyId);

          await prisma.lobby.update({
            data: {
              isActive: false,
              movieId: newLobbyWithResult.result.id,
            },
            where: {
              id: newLobbyWithResult.id,
            },
          });

          client.emit('movieVoted', lobbyId);
        }

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
