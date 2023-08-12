import { appRouter } from '../../index';
import { prisma } from '@movie/db';
import { type Session } from '@movie/auth';

type CallerOptions = {
  session?: Session | null;
};

export const createCaller = ({ session }: CallerOptions = {}) => {
  const ctx = {
    session: !!session ? session : null,
    prisma,
  };
  return appRouter.createCaller(ctx);
};
