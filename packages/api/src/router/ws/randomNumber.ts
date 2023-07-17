import { observable } from '@trpc/server/observable';
import { publicProcedure } from '../../trpc';

export const randomNumber = publicProcedure.subscription(() => {
  return observable<{ randomNumber: number }>((emit) => {
    const timer = setInterval(() => {
      emit.next({ randomNumber: Math.random() });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });
});
