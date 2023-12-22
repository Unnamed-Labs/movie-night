import type { Participant } from './Participant';
import type { Room } from './Room';

export type Lobby = {
  user: Participant;
  room: Room;
};
