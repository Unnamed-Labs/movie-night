import { render } from '@testing-library/react';
import Participant from '~/components/Participantcomp';

const Name = 'Riley';
const image = { src: 'example.jpg', alt: 'alt text' };

describe('<Participant />', () => {
  it('should mount', () => {
    const { getByTestId } = render(
      <Participant
        name={Name}
        image={image}
      />,
    );
    const elem = getByTestId('participant');
    expect(elem).toBeInTheDocument();
  });
});
