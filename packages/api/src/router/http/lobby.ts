import { z } from 'zod';
import { prisma } from '@movie/db';
import { createId } from '@paralleldrive/cuid2';
import { Logger, type ILogObj } from 'tslog';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { User } from '../../types/User';
import type { Lobby } from '../../types/Lobby';
import type { Movie } from '../../types/Movie';

const log: Logger<ILogObj> = new Logger();

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
      try {
        let availableCode = await prisma.roomCode.findFirst({
          where: {
            isActive: false,
          },
        });

        if (!availableCode) {
          return null;
        }

        let roomCode = await prisma.roomCode.updateMany({
          data: {
            isActive: true,
            version: {
              increment: 1,
            },
          },
          where: {
            id: availableCode.id,
            version: availableCode.version,
          },
        });

        while (roomCode.count === 0) {
          availableCode = await prisma.roomCode.findFirst({
            where: {
              isActive: false,
            },
          });

          if (!availableCode) {
            return null;
          }

          roomCode = await prisma.roomCode.updateMany({
            data: {
              isActive: true,
              version: {
                increment: 1,
              },
            },
            where: {
              id: availableCode.id,
              version: availableCode.version,
            },
          });
        }

        const user: User = {
          id: createId(),
          name: name,
          isHost: true,
          accountId,
        };

        const lobby: Lobby = {
          id: createId(),
          amount: 8,
          code: availableCode.code,
          participants: [user],
          proposed: [],
          votes: [],
        };

        await prisma.lobby.create({
          data: {
            id: lobby.id,
            code: availableCode.code,
            isActive: true,
          },
        });

        await client.set(lobby.id, JSON.stringify(lobby));

        return {
          user,
          lobby,
        };
      } catch (e) {
        log.error('lobby failed to be created:', e);
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
          log.warn(`active lobby not found in db for code [${code}]`);
          return null;
        }

        const lobby = await getLobby(pRoom.id);

        if (!lobby) {
          log.warn(`lobby not found in cache for roomId [${pRoom.id}]`);
          return null;
        }

        if (lobby.participants.length >= 8) {
          log.warn(`lobby full, join attempt rejected for lobbyId [${lobby.id}]`);
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
        log.error('lobby failed to be joined:', e);
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
        log.error(`lobby not found in cache for lobbyId [${lobbyId}]`);
        return null;
      }

      return lobby.proposed;
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
        log.error(`no result found for lobbyId [${lobbyId}]`);
        return null;
      }

      if (!result.movie) {
        log.error(`no movie found for the result of lobbyId [${lobbyId}]`);
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
          log.error(`lobby not found in cache for lobbyId [${lobbyId}]`);
          return {
            waiting: false,
            vote: false,
            error: true,
          };
        }

        const user = lobby.participants.find((participant) => participant.id === userId);

        if (!user) {
          log.warn(`user [${userId}] not in participants list for lobbyId [${lobbyId}]`);
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
          log.warn(`user [${userId}] has already suggested a movie`);
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
        log.error('user suggestion failed to submit:', e);
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
          log.error(`lobby not found in cache for lobbyId [${lobbyId}]`);
          return {
            waiting: false,
            results: false,
            error: true,
          };
        }

        const user = lobby.participants.find((participant) => participant.id === userId);

        if (!user) {
          log.warn(`user [${userId}] not in participants list for lobbyId [${lobbyId}]`);
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
          log.warn(`user [${userId}] has already voted for a movie`);
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
        let hasTies = false;

        if (haveAllVoted) {
          let result: Movie | null = null;
          let maxVotes = 0;
          const ties = [newLobby.votes[0]];

          for (const vote of newLobby.votes) {
            if (vote.users.length > maxVotes) {
              result = vote.movie;
              maxVotes = vote.users.length;
            } else if (vote.users.length === maxVotes) {
              ties.push(vote);
            }
          }

          // logic for ties
          if (ties.length > 1) {
            const newLobbyWithTies: Lobby = {
              ...newLobby,
              proposed: ties,
              votes: [],
            };

            await client.set(lobbyId, JSON.stringify(newLobbyWithTies));

            hasTies = true;

            log.info(`tie occurred in lobby [${newLobbyWithTies.id}]`);
          } else {
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

            await prisma.roomCode.update({
              data: {
                isActive: false,
                updatedDate: new Date(),
              },
              where: {
                code: newLobbyWithResult.code,
              },
            });

            log.info(`lobby closing [${newLobbyWithResult.id}]`);
          }

          client.emit('movieVoted', lobbyId, hasTies);
        }

        return {
          waiting: !haveAllVoted,
          results: haveAllVoted,
          tied: hasTies,
          error: false,
        };
      } catch (e) {
        log.error('user vote failed to submit:', e);
        return {
          waiting: false,
          results: false,
          error: true,
        };
      }
    }),
});
