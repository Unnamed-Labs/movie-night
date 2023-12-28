import { useRouter } from 'next/router';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

const Waiting = () => {
  const router = useRouter();
  const { room } = useLobby();

  api.lobbyWs.onMovieProposed.useSubscription(
    { roomId: room.id },
    {
      onData(data) {
        if (data) {
          void router.push('/vote');
        }
      },
    },
  );

  api.lobbyWs.onMovieVoted.useSubscription(
    { roomId: room.id },
    {
      onData(data) {
        if (data) {
          void router.push('/results');
        }
      },
    },
  );

  return (
    <Page
      title="Movie Night"
      body=""
    >
      <div>Waiting...</div>
    </Page>
  );
};

export default Waiting;
