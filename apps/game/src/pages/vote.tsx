import { useState } from 'react';
import { useRouter } from 'next/router';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { Button, MovieCard } from '@movie/ui';
import { appRouter, createInnerTRPCContext, type Movie } from '@movie/api';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';
import { useLobby } from '~/hooks/useLobby';

export const getServerSideProps = async () => {
  const serverHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: superjson,
  });
  await serverHelpers.movie.getProposed.prefetch();
  return {
    props: {
      trpcState: serverHelpers.dehydrate(),
    },
  };
};

const Vote = () => {
  const router = useRouter();
  const { room, loading, error, submitVote } = useLobby();
  const { data: proposed } = api.movie.getProposed.useQuery({ roomId: room.id });
  const [selectedMovie, setSelectedMovie] = useState<Movie>();

  const isDisabled = (movie: Movie) => selectedMovie && selectedMovie.name != movie.name;

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleLockInClick = async () => {
    const res = await submitVote(selectedMovie.id);

    if (res.waiting) {
      void router.push('/waiting');
    }

    if (res.results) {
      void router.push('/results');
    }
  };

  return (
    <Page
      title="Movie Night"
      body="Vote on what you want to watch."
      loading={loading}
      error={error}
    >
      {proposed &&
        proposed.map((option) => (
          <MovieCard
            key={option.movie.id}
            title={option.movie.name}
            description={option.movie.description}
            image={option.movie.image}
            categories={option.movie.genres}
            date={option.movie.date}
            location={option.movie.location}
            rating={option.movie.rating}
            runtime={option.movie.runtime}
            score={option.movie.score * 100}
            disabled={isDisabled(option.movie)}
            selectable
            onClick={() => handleCardClick(option.movie)}
          />
        ))}
      <Button onClick={handleLockInClick}>Lock in</Button>
    </Page>
  );
};

export default Vote;
