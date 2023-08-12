import { createServer } from '../../../../apps/server/src/server';
import { createCaller } from '../helpers/caller';

const session = {
  user: {
    id: 'asdf',
    name: 'dave',
  },
  expires: '0',
};

describe('hello()', () => {
  const server = createServer();

  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('displays hello world', async () => {
    const caller = createCaller();
    expect(await caller.hello()).toEqual({ text: 'hello world' });
  });

  it('displays hello {username}', async () => {
    const caller = createCaller();
    expect(await caller.hello({ username: 'depthcharge' })).toEqual({ text: 'hello depthcharge' });
  });

  it('displays hello {ctx.session.user.name}', async () => {
    const caller = createCaller({ session });
    expect(await caller.hello()).toEqual({ text: 'hello dave' });
  });
});
