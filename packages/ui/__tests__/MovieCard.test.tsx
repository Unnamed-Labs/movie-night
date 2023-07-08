import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovieCard } from '../src/components/MovieCard';
import Shrek from './data/movie';

describe('<MovieCard />', () => {
  it('should mount', () => {
    const { getByTestId } = render(
      <MovieCard
        categories={Shrek.categories}
        date={Shrek.date}
        description={Shrek.description}
        image={Shrek.image}
        location={Shrek.location}
        rating={Shrek.rating}
        runtime={Shrek.runtime}
        score={Shrek.score}
        title={Shrek.title}
      />,
    );
    const elm = getByTestId('movie-card');
    expect(elm).toBeInTheDocument();
  });
  it('should toggle the description visibility', async () => {
    const { getByTestId } = render(
      <MovieCard
        categories={Shrek.categories}
        date={Shrek.date}
        description={Shrek.description}
        image={Shrek.image}
        location={Shrek.location}
        rating={Shrek.rating}
        runtime={Shrek.runtime}
        score={Shrek.score}
        title={Shrek.title}
        collapsible
      />,
    );
    expect(getByTestId('movie-card-info-btn')).toBeInTheDocument();
    expect(getByTestId('movie-card-info-btn')).toHaveTextContent('View info');
    await userEvent.click(getByTestId('movie-card-info-btn'));
    expect(getByTestId('movie-card-info-btn')).toHaveTextContent('Hide info');
  });
  it('should select the card when clicked', async () => {
    const { getByTestId } = render(
      <MovieCard
        categories={Shrek.categories}
        date={Shrek.date}
        description={Shrek.description}
        image={Shrek.image}
        location={Shrek.location}
        rating={Shrek.rating}
        runtime={Shrek.runtime}
        score={Shrek.score}
        title={Shrek.title}
        selectable
      />,
    );
    expect(getByTestId('movie-card')).toBeInTheDocument();
    expect(getByTestId('movie-card')).toHaveClass('ui-shadow-black');
    await userEvent.click(getByTestId('movie-card'));
    expect(getByTestId('movie-card')).toHaveClass('ui-shadow-purple-300');
  });
  it('should not select the card when disabled and clicked', async () => {
    const { getByTestId } = render(
      <MovieCard
        categories={Shrek.categories}
        date={Shrek.date}
        description={Shrek.description}
        image={Shrek.image}
        location={Shrek.location}
        rating={Shrek.rating}
        runtime={Shrek.runtime}
        score={Shrek.score}
        title={Shrek.title}
        selectable
        disabled
      />,
    );
    expect(getByTestId('movie-card')).toBeInTheDocument();
    expect(getByTestId('movie-card')).toHaveClass('ui-shadow-black');
    await userEvent.click(getByTestId('movie-card'));
    expect(getByTestId('movie-card')).toHaveClass('ui-shadow-black');
  });
});
