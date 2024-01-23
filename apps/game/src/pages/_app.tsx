import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Pacifico, Raleway, Work_Sans } from 'next/font/google';
import { api } from '~/utils/api';

import '@movie/ui/dist/index.css';
import '~/styles/globals.css';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
});

const raleway = Raleway({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-raleway',
});

const workSans = Work_Sans({
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-work-sans',
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <main className={`${pacifico.variable} ${raleway.variable} ${workSans.variable}`}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </main>
);

export default api.withTRPC(MyApp);
