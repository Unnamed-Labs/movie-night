import { z } from 'zod';
import { prisma } from '@movie/db';
import { createId } from '@paralleldrive/cuid2';
import { Logger, type ILogObj } from 'tslog';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { client } from '../../utils/redisClient';
import type { User } from '../../types/User';
import type { Lobby } from '../../types/Lobby';
import { MovieSchema, type Movie } from '../../types/Movie';
import type { MovieLobby } from '../../types/MovieLobby';

const log: Logger<ILogObj> = new Logger();

const getLobby = async (lobbyId: string) => {
  const lobbyFromRedis = await client.get(lobbyId);

  if (!lobbyFromRedis) {
    return null;
  }

  const lobby = JSON.parse(lobbyFromRedis) as Lobby;

  return lobby;
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
          hasProposed: false,
          hasVoted: false,
        };

        const lobby: Lobby = {
          id: createId(),
          amount: 8,
          code: availableCode.code,
          participants: {
            [user.id]: user,
          },
          movies: {},
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

        if (Object.keys(lobby.participants).length >= 8) {
          log.warn(`lobby full, join attempt rejected for lobbyId [${lobby.id}]`);
          return null;
        }

        const user: User = {
          id: createId(),
          name,
          isHost,
          hasProposed: false,
          hasVoted: false,
        };

        const newLobby: Lobby = {
          ...lobby,
          participants: {
            ...lobby.participants,
            [user.id]: user,
          },
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
  getMoviesById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId } }) => {
      const lobby = await getLobby(lobbyId);

      if (!lobby) {
        log.error(`lobby not found in cache for lobbyId [${lobbyId}]`);
        return null;
      }

      return lobby.movies;
    }),
  getResultById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId } }) => {
      const result = await prisma.lobby.findFirst({
        select: {
          movie: {
            select: {
              title: true,
              imageSrc: true,
              imageAlt: true,
            },
          },
          winners: {
            select: {
              name: true,
              user: {
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
        log.warn(`no result found for lobbyId [${lobbyId}]`);
        return null;
      }

      if (!result.movie) {
        log.warn(`no movie found for the result of lobbyId [${lobbyId}]`);
        return null;
      }

      if (!result.winners || (result.winners && result.winners.length == 0)) {
        log.warn(`no winner found for the result of lobbyId [${lobbyId}]`);
      }

      return result;
    }),
  submitProposedMovieById: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid2(),
        movie: MovieSchema,
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

        const user = lobby.participants[userId];

        if (!user) {
          log.warn(`user [${userId}] not in participants list for lobbyId [${lobbyId}]`);
          return {
            waiting: false,
            vote: false,
            error: true,
          };
        }

        if (user.hasProposed) {
          log.warn(`user [${userId}] has already suggested a movie`);
          return {
            waiting: false,
            vote: false,
            error: true,
          };
        }

        let newMovieLobby: MovieLobby;
        if (lobby && lobby.movies && lobby.movies[movie.id]) {
          newMovieLobby = {
            ...lobby.movies[movie.id],
            movie,
            proposedBy: [...lobby.movies[movie.id].proposedBy, userId],
          };
        } else if (lobby && lobby.movies && !lobby.movies[movie.id]) {
          newMovieLobby = {
            movie,
            proposedBy: [userId],
            votedBy: [],
          };
        } else {
          throw Error('lobby does not exist');
        }

        const newUser: User = {
          ...lobby.participants[user.id],
          hasProposed: true,
        };

        const newLobby = {
          ...lobby,
          movies: {
            ...lobby.movies,
            [movie.id]: newMovieLobby,
          },
          participants: {
            ...lobby.participants,
            [user.id]: newUser,
          },
        };

        await client.set(lobbyId, JSON.stringify(newLobby));

        const haveAllProposed = Object.keys(newLobby.participants).every(
          (key) => newLobby.participants[key].hasProposed,
        );

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
        movie: MovieSchema,
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
            tied: false,
            error: true,
          };
        }

        const user = lobby.participants[userId];

        if (!user) {
          log.warn(`user [${userId}] not in participants list for lobbyId [${lobbyId}]`);
          return {
            waiting: false,
            results: false,
            tied: false,
            error: true,
          };
        }

        if (user.hasVoted) {
          log.warn(`user [${userId}] has already voted for a movie`);
          return {
            waiting: false,
            results: false,
            tied: false,
            error: true,
          };
        }

        let newMovieLobby: MovieLobby;
        if (lobby && lobby.movies && lobby.movies[movie.id]) {
          newMovieLobby = {
            ...lobby.movies[movie.id],
            movie,
            votedBy: [...lobby.movies[movie.id].votedBy, userId],
          };
        } else if (lobby && lobby.movies && !lobby.movies[movie.id]) {
          newMovieLobby = {
            movie,
            proposedBy: [],
            votedBy: [userId],
          };
        } else {
          throw Error('lobby does not exist');
        }

        const newUser: User = {
          ...lobby.participants[user.id],
          hasVoted: true,
        };

        const newLobby = {
          ...lobby,
          movies: {
            ...lobby.movies,
            [movie.id]: newMovieLobby,
          },
          participants: {
            ...lobby.participants,
            [user.id]: newUser,
          },
        };

        await client.set(lobbyId, JSON.stringify(newLobby));

        const haveAllVoted = Object.keys(newLobby.participants).every(
          (key) => newLobby.participants[key].hasVoted,
        );
        let hasTies = false;

        if (haveAllVoted) {
          const movieKeys = Object.keys(newLobby.movies);
          let result: Movie = newLobby.movies[movieKeys[0]].movie;
          let maxVotes = newLobby.movies[movieKeys[0]].votedBy.length;
          let winnerIds: string[] = newLobby.movies[movieKeys[0]].proposedBy;
          const ties = {
            [movieKeys[0]]: newLobby.movies[movieKeys[0]],
          };

          for (let i = 1; i < movieKeys.length; i++) {
            const currentMovie = newLobby.movies[movieKeys[i]];
            const votes = currentMovie.votedBy.length;
            if (votes > maxVotes) {
              result = currentMovie.movie;
              maxVotes = votes;
              winnerIds = currentMovie.proposedBy;
            } else if (votes === maxVotes) {
              const newProposal = {
                ...currentMovie,
                votedBy: [],
              };
              ties[currentMovie.movie.id] = newProposal;
            }
          }

          // logic for ties
          if (Object.keys(ties).length > 1) {
            const newLobbyWithTies: Lobby = {
              ...newLobby,
              movies: ties,
            };

            await client.set(lobbyId, JSON.stringify(newLobbyWithTies));

            hasTies = true;

            log.info(`tie occurred in lobby [${newLobbyWithTies.id}]`);
          } else {
            const newLobbyWithResult = {
              ...newLobby,
              result,
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

            const winners = winnerIds.map((winnerId) => newLobbyWithResult.participants[winnerId]);
            for (const winner of winners) {
              await prisma.winner.create({
                data: {
                  lobbyId,
                  name: winner.name,
                  userId: winner.accountId,
                },
              });
            }

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
          tied: false,
          error: true,
        };
      }
    }),
});
