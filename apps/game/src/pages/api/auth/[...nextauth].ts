import NextAuth from 'next-auth';
import { authOptions } from 'apps/game/src/server/auth';

export default NextAuth(authOptions);
