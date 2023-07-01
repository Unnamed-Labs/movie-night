import { useState } from 'react';
import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Timer } from '@movie/ui';
import { Button } from '@movie/ui';
import { Input } from '@movie/ui';
import { api } from '~/utils/api';

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  const [firstName, setFirstName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>('');
  // const [search, setSearch] = useState<string>('');

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    if (newPhoneNumber.length !== 10) {
      setPhoneNumberError(true);
    } else if (!/[0-9].+/.exec(newPhoneNumber)) {
      setPhoneNumberError(true);
    } else {
      setPhoneNumberError(false);
    }
    setPhoneNumber(newPhoneNumber);
  };

  return (
    <>
      <main className="flex min-h-screen flex-col gap-8 bg-slate-900 p-8">
        <h1 className="text-center text-5xl font-extrabold tracking-tight text-white">
          Movie Night Components
        </h1>
        <section className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Button</h2>
          <Button variant="primary">Ready</Button>
          <Button variant="secondary">Ready</Button>
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
        <section className="flex flex-col items-center gap-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">Input Field</h2>
          <Input
            label="First name"
            value={firstName}
            onChange={setFirstName}
            required
          />
          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            helpText="Your contact email"
          />
          <Input
            label="Phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            error={phoneNumberError ? 'Invalid phone number' : ''}
          />
          <Input
            placeholder="My placeholder field"
            value={placeholder}
            onChange={setPlaceholder}
          />
          {/* <Input
            placeholder="Search"
            leftIcon={<HiMagnifyingGlass />}
            value={search}
            onChange={setSearch}
          /> */}
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
