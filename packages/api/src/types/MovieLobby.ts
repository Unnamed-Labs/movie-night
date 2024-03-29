import { type Movie } from './Movie';

export type MovieLobby = {
  movie: Movie;
  proposedBy: string[];
  votedBy: string[];
};
