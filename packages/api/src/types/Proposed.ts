import type { Movie } from './Movie';
import type { Participant } from './Participant';

export type Proposed = {
  movie: Movie;
  user: Participant;
};
