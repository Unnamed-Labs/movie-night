import type { Movie } from './Movie';
import type { Participant } from './Participant';
import type { Proposed } from './Proposed';

export type Lobby = {
  id: string;
  amount: number;
  code: string;
  participants: Participant[];
  proposed: Proposed[];
  votes: any[];
  result?: Movie;
};
