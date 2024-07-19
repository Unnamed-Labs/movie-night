import { Buzzy } from '~/components/Buzzy';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <p className="font-raleway pb-8 text-3xl">welcome to</p>
      <div className="relative flex h-[132px] items-end">
        <Buzzy />
        <h1 className="font-pacifico bg-slate-950 text-6xl">Movie Night</h1>
      </div>
      <p className="font-raleway mt-8 pt-8 text-base">waitlist coming soon...</p>
    </main>
  );
}
