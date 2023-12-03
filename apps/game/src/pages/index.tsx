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
      body="Welcome to Movie Night! Login or start a room as a guest."
    >
      <Button
        variant="secondary"
        onClick={handleDiscordLogin}
      >
        Login with Discord
      </Button>
      <Button
        variant="standalone"
        onClick={handleGuestContinue}
      >
        Continue as guest
      </Button>
    </Page>
  );
};

export default Home;
