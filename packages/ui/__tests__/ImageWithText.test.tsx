import { render } from '@testing-library/react';
import { ImageWithText } from '../src/components/ImageWithText';

const src = 'example.jpg';
const text = 'my text';

describe('<ImageWithText />', () => {
  it('should mount', () => {
    const { getByTestId } = render(
      <ImageWithText
        src={src}
        text={text}
      />,
    );
    const comp = getByTestId('image-with-text');
    expect(comp).toBeInTheDocument();
  });
  it('should have props', () => {
    const { getByTestId } = render(
      <ImageWithText
        src={src}
        text={text}
      />,
    );
    const image = getByTestId('image-with-text-img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', src);
    expect(image).toHaveAttribute('alt', text);

    const textElem = getByTestId('image-with-text-text');
    expect(textElem).toHaveTextContent(text);
  });
  it('should have props with custom data-testid', () => {
    const id = 'custom-id';
    const { getByTestId } = render(
      <ImageWithText
        src={src}
        text={text}
        data-testid={id}
      />,
    );
    const comp = getByTestId(id);
    expect(comp).toBeInTheDocument();

    const image = getByTestId(`${id}-img`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', src);
    expect(image).toHaveAttribute('alt', text);

    const textElem = getByTestId(`${id}-text`);
    expect(textElem).toHaveTextContent(text);
  });
});
