import '~/styles/globals.css';

import { Raleway, Pacifico } from 'next/font/google';

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

export default function App({ Component, pageProps }) {
  return (
    <main className={`${pacifico.variable} ${raleway.variable} bg-slate-950 text-slate-50`}>
      <Component {...pageProps} />
    </main>
  );
}
