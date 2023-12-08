import { prisma } from '../index';
import ratings from './data/ratings.json';
import genres from './data/genres.json';
import actions from './data/actions.json';
import movies from './data/movies.json';

type Nvp = {
  id: string;
  name: string;
};

const createRatings = async () => {
  const createRating = async (rating: Nvp) => {
    await prisma.rating.upsert({
      where: {
        id: rating.id,
      },
      create: {
        id: rating.id,
        name: rating.name,
      },
      update: {},
    });
  };

  for (const rating of ratings) {
    await createRating(rating);
  }
};

const createGenres = async () => {
  const createGenre = async (genre: Nvp) => {
    await prisma.genre.upsert({
      where: {
        id: genre.id,
      },
      create: {
        id: genre.id,
        name: genre.name,
      },
      update: {},
    });
  };

  for (const genre of genres) {
    await createGenre(genre);
  }
};

const createActions = async () => {
  const createAction = async (action: Nvp) => {
    await prisma.action.upsert({
      where: {
        id: action.id,
      },
      create: {
        id: action.id,
        name: action.name,
      },
      update: {},
    });
  };

  for (const action of actions) {
    await createAction(action);
  }
};

const createMovies = async () => {
  for (const movie of movies) {
    await prisma.movie.upsert({
      where: {
        id: movie.id,
      },
      create: {
        id: movie.id,
        name: movie.name,
        description: movie.description,
        runtime: movie.runtime,
        score: movie.score,
        year: movie.year,
        rating: movie.rating,
        genres: movie.genres,
        date: movie.date,
        location: movie.location,
        imageSrc: movie.imageSrc,
        imageAlt: movie.imageAlt,
      },
      update: {},
      include: {
        rating: true,
        genres: true,
      },
    });
  }
};

const main = async () => {
  await createRatings();
  await createGenres();
  await createActions();
  await createMovies();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
