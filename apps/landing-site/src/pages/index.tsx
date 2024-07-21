import Head from 'next/head';
import { Buzzy } from '~/components/Buzzy';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Movie Night</title>
        <meta
          name="description"
          content="A web app to help friends decide on a movie to watch."
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center px-4 pt-16 xl:pt-24">
        <p className="font-raleway pb-8 text-3xl">welcome to</p>
        <div className="flex flex-col items-end gap-2">
          <Buzzy />
          <h1 className="font-pacifico text-5xl md:text-6xl xl:text-7xl">Movie Night</h1>
        </div>
        <p className="font-raleway mt-8 pt-8 text-base">waitlist coming soon...</p>
      </main>
    </>
  );
}
