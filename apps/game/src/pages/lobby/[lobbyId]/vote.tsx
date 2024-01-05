import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, MovieCard } from '@movie/ui';
import { type Movie } from '@movie/api';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';
import { useLobby } from '~/hooks/useLobby';

const Vote = () => {
  const router = useRouter();
  const { lobby, user, loading, error, submitVoteForMovieById } = useLobby();

  useEffect(() => {
    if (!lobby || !user) {
      void router.push('/lobby/join');
    }
  }, [lobby, user, router]);

  const { data: proposed } = api.lobby.getProposedById.useQuery({ lobbyId: lobby?.id });
  const [selectedMovie, setSelectedMovie] = useState<Movie>();

  const isDisabled = (movie: Movie) => selectedMovie && selectedMovie.title != movie.title;

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleLockInClick = async () => {
    const res = await submitVoteForMovieById(selectedMovie);

    if (res.waiting) {
      void router.push(`/lobby/${lobby?.id}/waiting`);
    }

    if (res.results) {
      void router.push(`/lobby/${lobby?.id}/result`);
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
            title={option.movie.title}
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
