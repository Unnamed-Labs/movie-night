import NextAuth from 'next-auth';
import { authOptions } from '@movie/auth';

export default NextAuth(authOptions);
