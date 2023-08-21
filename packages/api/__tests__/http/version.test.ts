import { createCaller } from '../helpers/caller';

describe('version()', () => {
  it('displays the current version', async () => {
    const caller = createCaller();
    expect(await caller.version()).toEqual({ version: '0.1.0' });
  });
});
