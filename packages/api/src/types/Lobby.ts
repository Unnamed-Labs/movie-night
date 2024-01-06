import type { Movie } from './Movie';
import type { User } from './User';
import type { MovieUser } from './MovieUser';

export type Lobby = {
  id: string;
  amount: number;
  code: string;
  participants: User[];
  proposed: MovieUser[];
  votes: MovieUser[];
  result?: Movie;
};
