import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovieCard } from '../src/components/MovieCard';
import Shrek from './data/movie';

describe('<MovieCard />', () => {
  it('should mount', () => {
    const { getByTestId } = render(
      <MovieCard
        date={Shrek.date}
        image={Shrek.image}
        rating={Shrek.rating}
        runtime={Shrek.runtime}
        title={Shrek.title}
      />,
    );
    const elm = getByTestId('movie-card');
    expect(elm).toBeInTheDocument();
  });
  it('should select the card when clicked', async () => {
    const { getByTestId } = render(
      <MovieCard
        date={Shrek.date}
        image={Shrek.image}
        rating={Shrek.rating}
        runtime={Shrek.runtime}
        title={Shrek.title}
      />,
    );
    expect(getByTestId('movie-card')).toBeInTheDocument();
    await userEvent.click(getByTestId('movie-card'));
    expect(getByTestId('movie-card-selected-filter')).toHaveClass('ui-opacity-15');
  });
  it('should not select the card when disabled and clicked', async () => {
    const { getByTestId } = render(
      <MovieCard
        date={Shrek.date}
        image={Shrek.image}
        rating={Shrek.rating}
        runtime={Shrek.runtime}
        title={Shrek.title}
        disabled
      />,
    );
    expect(getByTestId('movie-card')).toBeInTheDocument();
    expect(getByTestId('movie-card-disabled-filter')).toHaveClass('ui-opacity-50');
    await userEvent.click(getByTestId('movie-card'));
    expect(getByTestId('movie-card-disabled-filter')).toHaveClass('ui-opacity-50');
  });
});
