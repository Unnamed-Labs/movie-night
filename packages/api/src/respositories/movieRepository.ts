import { prisma } from '@movie/db';
import { type MovieSelect } from '../types/MovieSelect';

export const getPopular = async (): Promise<MovieSelect[]> => {
  return await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      date: true,
      runtime: true,
      imageSrc: true,
      imageAlt: true,
      rating: {
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
};

export const searchMovies = async (query: string): Promise<MovieSelect[]> => {
  return await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      date: true,
      runtime: true,
      imageSrc: true,
      imageAlt: true,
      rating: {
        select: {
          name: true,
        },
      },
    },
    where: {
      title: {
        contains: query.toLowerCase(),
      },
    },
  });
};
