import { prisma } from '../index';
import ratings from './data/ratings.json';
import genres from './data/genres.json';
import { movies } from './data/movies';

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

const createMovies = async () => {
  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        title: movie.title,
        description: movie.description,
        runtime: movie.runtime,
        score: movie.score,
        ratingId: movie.ratingId,
        date: movie.date,
        location: movie.location,
        imageSrc: movie.imageSrc,
        imageAlt: movie.imageAlt,
      },
      include: {
        rating: true,
        genres: true,
      },
    });
  }
};

const createRoomCodes = async () => {
  const codes = [];
  for (let i = 0; i <= 4; i++) {
    const code = ('0000' + i).toString().slice(-4);
    codes.push(code);
  }

  for (const code of codes) {
    await prisma.roomCode.create({
      data: {
        code,
        isActive: false,
      },
    });
  }
};

const main = async () => {
  await createRatings();
  await createGenres();
  await createMovies();
  await createRoomCodes();
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
