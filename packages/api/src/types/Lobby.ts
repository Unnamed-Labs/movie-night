import type { Movie } from './Movie';
import { type MovieMap } from './MovieMap';
import { type UserMap } from './UserMap';

export type Lobby = {
  id: string;
  amount: number;
  code: string;
  participants: UserMap;
  movies: MovieMap;
  result?: Movie;
};
