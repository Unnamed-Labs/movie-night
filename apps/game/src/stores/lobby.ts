import type { Participant, Room } from '@movie/api';
import { create } from 'zustand';

type LobbyStore = {
  room?: Room;
  user?: Participant;
  setRoom: (room: Room) => void;
  setUser: (user: Participant) => void;
  addParticipant: (participant: Participant) => void;
};

export const useLobbyStore = create<LobbyStore>((set) => ({
  setRoom: (room: Room) => set({ room }),
  setUser: (user: Participant) => set({ user }),
  addParticipant: (participant: Participant) =>
    set((state) => {
      const updatedRoom = {
        ...state.room,
        participants: [...(state.room?.participants ?? []), participant],
      };
      return {
        room: updatedRoom,
      };
    }),
}));
