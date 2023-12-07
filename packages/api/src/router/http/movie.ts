import { prisma } from '@movie/db';
import { publicProcedure } from '../../trpc';

export const movie = publicProcedure.query(async () => {
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
  });

  const movies = pMovies.map((pMovie) => ({
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
});
