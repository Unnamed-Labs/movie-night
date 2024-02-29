import { render } from '@testing-library/react';
import { Error } from '../src/components/Error';
import userEvent from '@testing-library/user-event';

const images = ['example.jpg'];
const text = 'my text';

describe('<Error />', () => {
  it('should mount', () => {
    const { getByTestId } = render(
      <Error
        images={images}
        text={text}
      />,
    );
    const comp = getByTestId('error');
    expect(comp).toBeInTheDocument();
  });
  it('should have props', () => {
    const { getByTestId } = render(
      <Error
        images={images}
        text={text}
      />,
    );
    const image = getByTestId('error-image-with-text-img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', images[0]);
    expect(image).toHaveAttribute('alt', text);

    const textElem = getByTestId('error-image-with-text-text');
    expect(textElem).toHaveTextContent(text);
  });
  it('should have props with custom data-testid', () => {
    const id = 'custom-id';
    const { getByTestId } = render(
      <Error
        images={images}
        text={text}
        data-testid={id}
      />,
    );
    const comp = getByTestId(`${id}-image-with-text`);
    expect(comp).toBeInTheDocument();

    const image = getByTestId(`${id}-image-with-text-img`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', images[0]);
    expect(image).toHaveAttribute('alt', text);

    const textElem = getByTestId(`${id}-image-with-text-text`);
    expect(textElem).toHaveTextContent(text);
  });
  it('should have the cta', async () => {
    let flag = false;
    const onClick = () => {
      flag = true;
    };
    const cta = {
      label: 'try again',
      onClick,
    };
    const { getByTestId } = render(
      <Error
        images={images}
        text={text}
        cta={cta}
      />,
    );
    const elem = getByTestId('error-cta');
    expect(elem).toHaveTextContent(cta.label);
    await userEvent.click(elem);
    expect(flag).toBeTruthy();
  });
});
