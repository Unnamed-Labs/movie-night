import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '~/components/global/Button';

describe('<Button />', () => {
  it('should mount', () => {
    const { getByText } = render(<Button>Ready</Button>);
    const elem = getByText('Ready');

    expect(elem).toBeTruthy();
  });

  it('should be a primary variant', () => {
    const { getByText } = render(<Button>Ready</Button>);
    const elem = getByText('Ready');

    expect(elem).toHaveClass('bg-emerald-300');
  });

  it('should be a secondary variant', () => {
    const { getByText } = render(<Button variant="secondary">Ready</Button>);
    const elem = getByText('Ready');

    expect(elem).toHaveClass('bg-purple-300');
  });

  it('should be a standalone variant', () => {
    const { getByText } = render(<Button variant="standalone">Ready</Button>);
    const elem = getByText('Ready');

    expect(elem).toHaveClass('underline');
  });

  it('should be disabled', () => {
    const { getByText } = render(<Button disabled>Ready</Button>);
    const elem = getByText('Ready');

    expect(elem).toHaveProperty('disabled');
    expect(elem).toHaveClass('bg-slate-700');
  });

  it('onClick should fire', async () => {
    let flag = false;
    const onClick = () => {
      flag = true;
    };
    const { getByText } = render(<Button onClick={onClick}>Ready</Button>);
    const elem = getByText('Ready');

    expect(flag).toBeFalsy();
    await userEvent.click(elem);
    expect(flag).toBeTruthy();
  });
});
