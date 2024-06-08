import { type Movie } from '../types/Movie';
import { type MovieSelect } from '../types/MovieSelect';

const transformMovie = (pMovie: MovieSelect): Movie => ({
  id: pMovie.id,
  title: pMovie.title,
  date: pMovie.date,
  runtime: pMovie.runtime,
  image: {
    src: pMovie.imageSrc,
    alt: pMovie.imageAlt,
  },
  rating: pMovie.rating.name,
  proposedBy: [],
  votedBy: [],
});

export const transformMovies = (pMovies: MovieSelect[] | null): Movie[] => {
  if (!pMovies) {
    return [];
  }
  return pMovies.filter((pMovie) => !!pMovie).map((pMovie) => transformMovie(pMovie));
};
