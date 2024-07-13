import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { startGame } from '../../services/gameService';

export const game = createTRPCRouter({
  start: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .mutation(({ input: { lobbyId } }) => {
      startGame(lobbyId);
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
