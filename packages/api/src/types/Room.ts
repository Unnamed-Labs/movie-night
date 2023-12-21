import type { Participant } from './Participant';

export type Room = {
  id: string;
  code: string;
  amount: number;
  participants?: Participant[];
};
