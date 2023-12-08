// import type { Movie } from '@movie/api';
// import { MovieCard } from '@movie/ui';
import { Page } from '~/components/Page';

const Results = () => {
  // const movies: Movie[] = [];
  return (
    <Page
      title="Movie Night"
      body="Congrats to Shrek. Enjoy!"
    >
      {/* <MovieCard
        title={movies[1].name}
        description={movies[1].description}
        image={movies[1].image}
        categories={movies[1].genres}
        date={movies[1].date}
        location={movies[1].location}
        rating={movies[1].rating}
        runtime={movies[1].runtime}
        score={movies[1].score * 100}
      /> */}
    </Page>
  );
};

export default Results;
