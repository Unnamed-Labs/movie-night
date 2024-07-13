import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import {
  closeLobby,
  getMovies,
  getResult,
  joinLobby,
  openLobby,
} from '../../services/lobbyService';

export const lobby = createTRPCRouter({
  open: publicProcedure
    .input(z.object({ accountId: z.string().cuid().optional(), name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return await openLobby(input);
    }),
  closeById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input: { id } }) => {
      await closeLobby(id);
    }),
  joinByCode: publicProcedure
    .input(z.object({ name: z.string(), isHost: z.boolean(), code: z.string().length(4) }))
    .mutation(async ({ input: { name, isHost, code } }) => {
      return await joinLobby(code, name, isHost);
    }),
  getMoviesById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId } }) => {
      return await getMovies(lobbyId);
    }),
  getResultById: publicProcedure
    .input(z.object({ lobbyId: z.string().cuid2() }))
    .query(async ({ input: { lobbyId } }) => {
      return await getResult(lobbyId);
    }),
});
