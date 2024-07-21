import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, UniversalPlacement, MovieCard } from '@movie/ui';
import { type Movie } from '@movie/api';
import { Page } from '~/components/Page';
import { api } from '~/utils/api';
import { useLobby } from '~/hooks/useLobby';

const Vote = () => {
  const router = useRouter();
  const { lobby, user, error, submitVoteForMovieById, setPreviousRoute } = useLobby();
  const errorImageNumber = Math.floor(Math.random() * 3) + 1;
  const errorImage = {
    src: `http://localhost:3000/error-${errorImageNumber}.jpeg`,
    alt: '',
  };

  useEffect(() => {
    setPreviousRoute(router.asPath);
  }, [router, setPreviousRoute]);

  useEffect(() => {
    if (!lobby || !user) {
      void router.push('/lobby/join');
    }
  }, [lobby, user, router]);

  const { data: lobbyMovies, refetch } = api.lobby.getMoviesById.useQuery({
    lobbyId: lobby?.id ?? '',
  });
  const [selectedMovie, setSelectedMovie] = useState<Movie>();

  const isDisabled = (movie: Movie) => selectedMovie && selectedMovie.title != movie.title;

  const handleCardClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleLockInClick = async () => {
    if (selectedMovie) {
      const res = await submitVoteForMovieById(selectedMovie);

      if (res.waiting) {
        void router.push(`/lobby/${lobby?.id}/waiting`);
      }

      if (res.results && !res.tied) {
        void router.push(`/lobby/${lobby?.id}/result`);
      }

      if (res.results && res.tied) {
        setSelectedMovie(undefined);
        void refetch();
      }
    }
  };

  return (
    <Page
      title="Movie Night"
      body="vote on your favorite movie."
    >
      {error ? (
        <UniversalPlacement
          heading="uh oh!"
          description={error}
          image={errorImage}
        />
      ) : (
        <>
          {lobbyMovies &&
            Object.keys(lobbyMovies) &&
            Object.keys(lobbyMovies).map((key) => (
              <MovieCard
                key={lobbyMovies[key].movie.id}
                title={lobbyMovies[key].movie.title}
                image={lobbyMovies[key].movie.image}
                date={lobbyMovies[key].movie.date}
                rating={lobbyMovies[key].movie.rating}
                runtime={lobbyMovies[key].movie.runtime}
                disabled={isDisabled(lobbyMovies[key].movie)}
                onClick={() => handleCardClick(lobbyMovies[key].movie)}
              />
            ))}
          <Button
            label="submit"
            onClick={handleLockInClick}
          />
        </>
      )}
    </Page>
  );
};

export default Vote;
