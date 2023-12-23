import { useRouter } from 'next/router';
import { Button } from '@movie/ui';
import { Page } from '~/components/Page';

const Lobby = () => {
  const router = useRouter();

  const handleHostClick = () => {
    void router.push(`/lobby/host`);
  };

  const handleJoinClick = () => {
    void router.push('/lobby/join');
  };

  return (
    <Page
      title="Movie Night"
      body="Would you like to host or join a lobby?"
    >
      <>
        <Button
          variant="primary"
          onClick={handleHostClick}
        >
          Host
        </Button>
        <Button
          variant="secondary"
          onClick={handleJoinClick}
        >
          Join
        </Button>
      </>
    </Page>
  );
};

export default Lobby;
