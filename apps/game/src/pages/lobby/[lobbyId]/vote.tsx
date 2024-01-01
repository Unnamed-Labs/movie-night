import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, MovieCard } from '@movie/ui';
import { type Movie } from '@movie/api';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';
import { useLobby } from '~/hooks/useLobby';

const Vote = () => {
  const router = useRouter();
  const { room, user, loading, error, submitVote } = useLobby();

  useEffect(() => {
    if (!room || !user) {
      void router.push('/lobby/join');
    }
  }, [room, user, router]);

  const { data: proposed } = api.lobby.getProposed.useQuery({ roomId: room?.id });
  const [selectedMovie, setSelectedMovie] = useState<Movie>();

  const isDisabled = (movie: Movie) => selectedMovie && selectedMovie.name != movie.name;

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleLockInClick = async () => {
    const res = await submitVote(selectedMovie.id);

    if (res.waiting) {
      void router.push(`/lobby/${room?.id}/waiting`);
    }

    if (res.results) {
      void router.push(`/lobby/${room?.id}/result`);
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
