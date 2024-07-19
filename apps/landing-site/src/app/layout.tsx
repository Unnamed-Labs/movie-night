import '~/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { Raleway, Pacifico } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Movie Night',
  description: 'A web app to help friends decide on a movie to watch.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${pacifico.variable} ${raleway.variable} ${GeistSans.variable}`}
    >
      <body className="bg-slate-950 text-slate-50">{children}</body>
    </html>
  );
}
