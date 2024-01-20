import { MovieCard } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

const Result = () => {
  const { lobby } = useLobby();

  if (!lobby) {
    return <div>Room not available...</div>;
  }

  const { data: result } = api.lobby.getResultById.useQuery({ lobbyId: lobby.id });
  const body = result ? `Congrats to ${result.title}. Enjoy!` : '';
  return (
    <Page
      title="Movie Night"
      body={body}
    >
      {result && (
        <MovieCard
          title={result.title}
          image={result.image}
          date={result.date}
          rating={result.rating}
          runtime={result.runtime}
        />
      )}
    </Page>
  );
};

export default Result;
