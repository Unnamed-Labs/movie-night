import { render } from '@testing-library/react';
import Button from '~/components/global/Button';

describe('<Button />', () => {
  it('should mount', () => {
    const { getByText } = render(<Button>Ready</Button>);
    const elem = getByText('Ready');

    expect(elem).toBeTruthy();
  });
});
