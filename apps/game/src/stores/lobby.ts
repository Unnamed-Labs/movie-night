import type { Participant, Room } from '@movie/api';
import { create } from 'zustand';

type LobbyStore = {
  body: string;
  room?: Room;
  user?: Participant;
  setBody: (body: string) => void;
  setRoom: (room: Room) => void;
  setUser: (user: Participant) => void;
};

export const useLobbyStore = create<LobbyStore>((set) => ({
  body: '',
  setBody: (body: string) => set({ body }),
  setRoom: (room: Room) => set({ room }),
  setUser: (user: Participant) => set({ user }),
}));
