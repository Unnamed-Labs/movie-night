import type { Room } from '@movie/api';
import { create } from 'zustand';

type LobbyStore = {
  body: string;
  room?: Room;
  setBody: (body: string) => void;
  setRoom: (room: Room) => void;
};

export const useLobbyStore = create<LobbyStore>((set) => ({
  body: '',
  setBody: (body: string) => set({ body }),
  setRoom: (room: Room) => set({ room }),
}));
