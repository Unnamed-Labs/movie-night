import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { api } from '~/utils/api';
import Timer from '~/components/timer';
import Button from '~/components/global/Button';

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
      <main className="flex min-h-screen flex-col gap-8 bg-gradient-to-b from-[#2e026d] to-[#15162c] p-8">
        <h1 className="text-center text-5xl font-extrabold tracking-tight text-white">
          Movie Night Components
        </h1>
        <section className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Button</h2>
          <Button variant="primary">Ready</Button>;<Button variant="secondary">Ready</Button>;
          <Button disabled>Ready</Button>
          <Button variant="standalone">Cancel</Button>
        </section>
        <section className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Timer</h2>
          <Timer initialTime={60} />
        </section>
        <section className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Auth Showcase</h2>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : 'Loading tRPC query...'}
            </p>
            <AuthShowcase />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};
