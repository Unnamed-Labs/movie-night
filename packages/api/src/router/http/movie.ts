import { z } from 'zod';
import { prisma } from '@movie/db';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import type { Movie } from '../../types/Movie';

export const movie = createTRPCRouter({
  getPopular: publicProcedure.query(async () => {
    const pMovies = await prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        description: true,
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
      title: pMovie.title,
      description: pMovie.description,
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
        title: true,
        description: true,
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
        title: {
          contains: input.query,
        },
      },
    });

    const movies: Movie[] = pMovies.map((pMovie) => ({
      id: pMovie.id,
      title: pMovie.title,
      description: pMovie.description,
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
});
