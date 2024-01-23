import { Button } from '@movie/ui';
import { useRouter } from 'next/router';
import { Page } from '~/components/Page';

const Home = () => {
  const router = useRouter();

  const handleDiscordLogin = () => {
    void router.push('/lobby');
  };

  const handleGuestContinue = () => {
    void router.push('/lobby');
  };

  return (
    <Page
      title="Movie Night"
      body="welcome to Movie Night! login or start a room as a guest."
    >
      <Button
        label="sign in with discord"
        variant="secondary"
        onClick={handleDiscordLogin}
      />
      <Button
        label="continue as guest"
        variant="standalone"
        onClick={handleGuestContinue}
      />
    </Page>
  );
};

export default Home;
