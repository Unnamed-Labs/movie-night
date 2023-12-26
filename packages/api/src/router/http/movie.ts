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
  // getResult: publicProcedure.input().query(),
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

        // lookup and verify
        const pParticipants = await prisma.participant.findMany({
          select: {
            id: true,
          },
          where: {
            roomId,
          },
        });

        const pParticipantsProposed = await prisma.participant.findMany({
          select: {
            id: true,
          },
          where: {
            roomId,
            hasProposed: true,
          },
        });

        ee.emit('movieProposed', roomId);

        return {
          waiting: !(pParticipants.length === pParticipantsProposed.length),
          vote: pParticipants.length === pParticipantsProposed.length,
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
      await prisma.vote.create({
        data: {
          participantId,
          movieId,
          roomId,
        },
      });
    }),
});
