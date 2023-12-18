import type { Participant } from '@movie/api';
import { create } from 'zustand';

type RoomStore = {
  id?: string;
  code?: string;
  amount: number;
  body: string;
  participants: Participant[];
  isLoading: boolean;
  error?: string;
  setId: (id: string) => void;
  setCode: (code: string) => void;
  setBody: (body: string) => void;
  addParticipant: (participant: Participant) => void;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
  amount: 8,
  body: '',
  participants: [],
  isLoading: false,
  setId: (id: string) => set({ id }),
  setCode: (code: string) => set({ code }),
  setBody: (body: string) => set({ body }),
  addParticipant: (participant: Participant) =>
    set((state) => ({ participants: [...state.participants, participant] })),
  setError: (error: string) => set({ error }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
