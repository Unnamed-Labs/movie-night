import type { Room } from './Room';

export type Participant = {
  id: string;
  name: string;
  isHost: boolean;
  isGuest: boolean;
  room?: Room;
  image?: {
    src: string;
    alt: string;
  };
};
