import { createCaller } from '../helpers/caller';

describe('randomNumber()', () => {
  it('returns a random number between 0 and 1', async () => {
    const caller = createCaller();
    const obs = await caller.randomNumber();
    let count = 0;
    const randomNumber = new Promise((resolve) => {
      obs.subscribe({
        next(data) {
          if (count > 0) {
            resolve(data.randomNumber);
          }
          count += 1;
        },
      });
    });
    expect(await randomNumber).toBeGreaterThan(0);
    expect(await randomNumber).toBeLessThan(1);
  });
});
