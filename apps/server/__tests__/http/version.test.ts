import { createServer } from '../../src/server';
import { api } from '../helpers/api';

describe('version()', () => {
  const server = createServer();

  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('displays the current version', async () => {
    expect(await api.version.query()).toEqual('hello world');
  });
});
