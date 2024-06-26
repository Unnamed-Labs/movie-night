import type { User, Lobby } from '@movie/api';
import { create } from 'zustand';

type LobbyStore = {
  lobby?: Lobby;
  user?: User;
  previousRoute?: string;
  setLobby: (lobby: Lobby) => void;
  setUser: (user: User) => void;
  addParticipant: (participant: User) => void;
  setPreviousRoute: (previousRoute: string) => void;
};

export const useLobbyStore = create<LobbyStore>((set) => ({
  setLobby: (lobby: Lobby) => set({ lobby }),
  setUser: (user: User) => set({ user }),
  addParticipant: (participant: User) =>
    set((state) => {
      if (state.lobby) {
        const updatedLobby = {
          ...state.lobby,
          participants: {
            ...state.lobby.participants,
            [participant.id]: participant,
          },
        };
        return {
          lobby: updatedLobby,
        };
      }
      return {};
    }),
  setPreviousRoute: (previousRoute: string) => set({ previousRoute }),
}));
