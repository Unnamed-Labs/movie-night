import { type Unsubscribable } from '@trpc/server/observable';
import { createCaller } from '../helpers/caller';

type WsPayload = {
  data: {
    randomNumber: number;
  };
  subscription: Unsubscribable;
};

describe('randomNumber()', () => {
  it('returns a random number between 0 and 1', async () => {
    const caller = createCaller();
    const observer = await caller.randomNumber();
    let count = 0;
    const payload: WsPayload = await new Promise((resolve) => {
      const subscription = observer.subscribe({
        next(data) {
          if (count > 0) {
            resolve({ data, subscription });
          }
          count += 1;
        },
      });
    });
    payload.subscription.unsubscribe();
    expect(payload.data.randomNumber).toBeGreaterThan(0);
    expect(payload.data.randomNumber).toBeLessThan(1);
  });
});
