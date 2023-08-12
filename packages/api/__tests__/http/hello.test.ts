import { createCaller } from '../helpers/caller';

const session = {
  user: {
    id: 'asdf',
    name: 'dave',
  },
  expires: '0',
};

describe('hello()', () => {
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
