import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileIcon } from '../src/components/ProfileIcon';

const src = 'example.jpg';
const alt = 'alt text';
const height = 64;
const width = 24;

describe('<ProfileIcon />', () => {
  it('should mount', () => {
    const { getByTestId } = render(
      <ProfileIcon
        src={src}
        alt={alt}
      />,
    );
    const elem = getByTestId('profile-icon');
    expect(elem).toBeInTheDocument();
  });
  it('should change height and width', () => {
    const { getByTestId } = render(
      <ProfileIcon
        src={src}
        alt={alt}
        height={height}
        width={width}
      />,
    );
    const elem = getByTestId('profile-icon');
    expect(elem).toHaveAttribute('style');
    expect(elem.getAttribute('style')).toContain(`height: ${height}px`);
    expect(elem.getAttribute('style')).toContain(`width: ${width}px`);
  });
  it('should show as disabled', () => {
    const { getByTestId } = render(
      <ProfileIcon
        src={src}
        alt={alt}
        disabled
      />,
    );
    const elem = getByTestId('profile-icon-disabled');
    expect(elem).toBeInTheDocument();
  });
  it('should be selectable', async () => {
    let flag = false;
    const onClick = () => {
      flag = true;
    };
    const { getByTestId } = render(
      <ProfileIcon
        src={src}
        alt={alt}
        selectable
        onClick={onClick}
      />,
    );
    const elem = getByTestId('profile-icon');
    expect(flag).toBeFalsy();
    await userEvent.click(elem);
    expect(flag).toBeTruthy();
  });
  it('should not be selectable when disabled', async () => {
    let flag = false;
    const onClick = () => {
      flag = true;
    };
    const { getByTestId } = render(
      <ProfileIcon
        src={src}
        alt={alt}
        disabled
        selectable
        onClick={onClick}
      />,
    );
    const elem = getByTestId('profile-icon');
    expect(flag).toBeFalsy();
    await userEvent.click(elem);
    expect(flag).toBeFalsy();
  });
});
