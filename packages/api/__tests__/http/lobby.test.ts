import { describe, test, expect, beforeAll } from 'vitest';
import { type Lobby, createInnerTRPCContext } from '../../index';
import { createCaller } from '../helpers/caller';
import { prismaMock } from '../helpers/singleton';

const lobby = {
  id: '1',
  code: '0000',
  amount: 8,
  isActive: true,
  movieId: null,
  createdDate: new Date(),
  updatedDate: new Date(),
};

describe.skip('lobby', () => {
  // const ctx = createInnerTRPCContext({ session: null });
  // const caller = createCaller()(ctx);

  // beforeAll(() => {
  //   prismaMock.lobby.create.mockResolvedValue(lobby);
  // });

  // test('creates a new active lobby', async () => {
  //   const { lobby } = (await caller.lobby.open({ name: 'Aaron' })) || {};
  //   const result = lobby as Lobby;
  //   expect(result).not.toBeNull();
  //   expect(result.code).toEqual('0001');
  // });
  // test('closes open lobby', async () => {
  //   try {
  //     await caller.lobby.closeById({ id: '1' });
  //     expect(true).toBeTruthy();
  //   } catch (e) {
  //     throw new Error();
  //   }
  // });
  // test('joins lobby', async () => {
  //   const { lobby } =
  //     (await caller.lobby.joinByCode({ code: '0000', name: 'Aaron', isHost: true })) || {};
  //   const result = lobby as Lobby;
  //   expect(result).not.toBeNull();
  //   expect(result.code).toEqual('0000');
  // });
  // test("doesn't join lobby when code doesn't exist", async () => {
  //   const result =
  //     (await caller.lobby.joinByCode({ code: '0000', name: 'Aaron', isHost: true })) || {};
  //   expect(result).toBeNull();
  // });
  // test("doesn't join lobby when lobby is inactive", async () => {
  //   const result =
  //     (await caller.lobby.joinByCode({ code: '0000', name: 'Aaron', isHost: true })) || {};
  //   expect(result).toBeNull();
  // });
  // test("doesn't join lobby when lobby is full", async () => {
  //   const result =
  //     (await caller.lobby.joinByCode({ code: '0000', name: 'Aaron', isHost: true })) || {};
  //   expect(result).toBeNull();
  // });
  // test('starts game', async () => {
  //   try {
  //     await caller.lobby.startGameById({ lobbyId: '1' });
  //     expect(true).toBeTruthy();
  //   } catch (e) {
  //     throw new Error();
  //   }
  // });
  test('gets movies by lobby id', async () => {});
  test("gets no movies when lobby id doesn't exist", async () => {});
  test("gets no moves when lobby doesn't exist", async () => {});
  test('gets result by id', async () => {});
  test('gets no results when lobby is active', async () => {});
  test("gets no results when id doesn't exist", async () => {});
  test('submits proposed movies', async () => {});
  test("doesn't submit proposed movies when lobby doesn't exist", async () => {});
  test("doesn't submit proposed movies when user doesn't exist in lobby", async () => {});
  test("doesn't submit proposed movies when user has already proposed a movie", async () => {});
  test("doesn't submit proposed movies if lobby doesn't exist", async () => {});
  test("doesn't submit proposed movies if lobby is closed", async () => {});
  test('ends propose step if all users have proposed', async () => {});
  test('submits voted movies', async () => {});
  test("doesn't submit voted movies when lobby doesn't exist", async () => {});
  test("doesn't submit voted movies when user doesn't exist in lobby", async () => {});
  test("doesn't submit voted movies when user has already voted for a movie", async () => {});
  test("doesn't submit voted movies if lobby doesn't exist", async () => {});
  test("doesn't submit voted movies if lobby is closed", async () => {});
  test('ends vote step if all users have voted', async () => {});
});
