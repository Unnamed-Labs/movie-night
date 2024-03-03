import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/Button';

describe('<Button />', () => {
  it('should mount', () => {
    const { getByText } = render(<Button label="ready" />);
    const elem = getByText('ready');

    expect(elem).toBeTruthy();
  });

  it('should be a primary variant', () => {
    const { getByText } = render(<Button label="ready" />);
    const elem = getByText('ready');

    expect(elem).toHaveClass('ui-bg-emerald-300');
  });

  it('should be a secondary variant', () => {
    const { getByText } = render(
      <Button
        label="ready"
        variant="secondary"
      />,
    );
    const elem = getByText('ready');

    expect(elem).toHaveClass('ui-bg-purple-300');
  });

  it('should be a standalone variant', () => {
    const { getByText } = render(
      <Button
        label="ready"
        variant="standalone"
      />,
    );
    const elem = getByText('ready');

    expect(elem).toHaveClass('ui-underline');
  });

  it('should be disabled', () => {
    const { getByText } = render(
      <Button
        label="ready"
        disabled
      />,
    );
    const elem = getByText('ready');

    expect(elem).toHaveProperty('disabled');
    expect(elem).toHaveClass('ui-bg-slate-700');
  });

  it('should have onClick fire', async () => {
    let flag = false;
    const onClick = () => {
      flag = true;
    };
    const { getByText } = render(
      <Button
        label="ready"
        onClick={onClick}
      />,
    );
    const elem = getByText('ready');

    expect(flag).toBeFalsy();
    await userEvent.click(elem);
    expect(flag).toBeTruthy();
  });

  it('should have async onClick fire', async () => {
    let flag = false;
    const onClick = async () => {
      flag = await Promise.resolve(true);
    };
    const { getByText } = render(
      <Button
        label="ready"
        onClick={onClick}
      />,
    );
    const elem = getByText('ready');

    expect(flag).toBeFalsy();
    await userEvent.click(elem);
    expect(flag).toBeTruthy();
  });
});
