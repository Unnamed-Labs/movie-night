import { useRouter } from 'next/router';
import { Button, MovieCard, Timer } from '@movie/ui';
import type { Movie } from '@movie/api';
import { Page } from '~/components/Page';

const Vote = () => {
  const router = useRouter();

  // Retrieve submitted movies
  const movies: Movie[] = [];

  // Select movies on card click
  // Disable unselected cards if 1 is already selected

  const handleLockInClick = () => {
    void router.push('/results');
  };

  return (
    <Page
      title="Movie Night"
      body="Vote on what you want to watch."
    >
      <Timer initialTime={60} />
      {movies.map((movie, idx) => (
        <MovieCard
          key={idx}
          title={movie.name}
          description={movie.description}
          image={movie.image}
          categories={movie.genres}
          date={movie.date}
          location={movie.location}
          rating={movie.rating}
          runtime={movie.runtime}
          score={movie.score * 100}
          selectable
        />
      ))}
      <Button onClick={handleLockInClick}>Lock in!</Button>
    </Page>
  );
};

export default Vote;
