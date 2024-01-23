import { MovieCard } from '@movie/ui';
import { Page } from '~/components/Page';
import { useLobby } from '~/hooks/useLobby';
import { api } from '~/utils/api';

const Result = () => {
  const { lobby } = useLobby();

  if (!lobby) {
    return <div>results not available...</div>;
  }

  const { data: result } = api.lobby.getResultById.useQuery({ lobbyId: lobby.id });
  const body = result ? `congrats to ${result.title}. enjoy!` : '';
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
