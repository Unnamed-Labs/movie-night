import '@movie/ui/dist/index.css';
import '~/styles/globals.css';

import { Raleway, Pacifico, Work_Sans } from 'next/font/google';

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

export default function App({ Component, pageProps }) {
  return (
    <main
      className={`${pacifico.variable} ${raleway.variable} ${workSans.variable} flex min-h-screen flex-col items-center bg-slate-950 px-4 pt-16 text-slate-50 xl:pt-24`}
    >
      <Component {...pageProps} />
    </main>
  );
}
