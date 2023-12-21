import { useEffect } from 'react';
import { Button } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { useRouter } from 'next/router';

const Lobby = () => {
  const router = useRouter();
  const { body, setBody } = useLobby();

  useEffect(() => {
    setBody('Would you like to host or join a lobby?');
  }, [setBody]);

  const handleHostClick = () => {
    void router.push(`/lobby/host`);
  };

  const handleJoinClick = () => {
    void router.push('/lobby/join');
  };

  return (
    <Page
      title="Movie Night"
      body={body}
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
