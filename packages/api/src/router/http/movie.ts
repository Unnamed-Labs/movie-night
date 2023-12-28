import { z } from 'zod';
import { prisma } from '@movie/db';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { ee } from '../../utils/eventEmitter';
import type { Movie } from '../../types/Movie';
import type { Proposed } from '../../types/Proposed';

export const movie = createTRPCRouter({
  getPopular: publicProcedure.query(async () => {
    const pMovies = await prisma.movie.findMany({
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
      where: {
        score: {
          gte: 0.75,
        },
      },
      take: 20,
    });

    const movies: Movie[] = pMovies.map((pMovie) => ({
      id: pMovie.id,
      name: pMovie.name,
      description: pMovie.description,
      year: pMovie.year,
      date: pMovie.date,
      score: pMovie.score,
      location: pMovie.location,
      runtime: pMovie.runtime,
      image: {
        src: pMovie.imageSrc,
        alt: pMovie.imageAlt,
      },
      rating: pMovie.rating.name,
      genres: pMovie.genres.map((genre) => genre.name),
    }));

    return movies;
  }),
  search: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
    const pMovies = await prisma.movie.findMany({
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
      where: {
        name: {
          contains: input.query,
        },
      },
    });

    const movies: Movie[] = pMovies.map((pMovie) => ({
      id: pMovie.id,
      name: pMovie.name,
      description: pMovie.description,
      year: pMovie.year,
      date: pMovie.date,
      score: pMovie.score,
      location: pMovie.location,
      runtime: pMovie.runtime,
      image: {
        src: pMovie.imageSrc,
        alt: pMovie.imageAlt,
      },
      rating: pMovie.rating.name,
      genres: pMovie.genres.map((genre) => genre.name),
    }));

    return movies;
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

        ee.emit('movieProposed', roomId);

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
        }

        ee.emit('movieVoted', roomId);

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
