import { ImageWithText } from './ImageWithText';
import { Button } from './Button';

export type ErrorProps = {
  images: string[];
  text: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  'data-testid'?: string;
};

export const Error = ({ images, text, cta, 'data-testid': dataTestId = 'error' }: ErrorProps) => {
  const imageIdx = Math.floor(Math.random() * images.length);
  const image = images[imageIdx];
  return (
    <section
      className="ui-flex ui-flex-col ui-justify-center ui-items-center ui-gap-16"
      data-testid={dataTestId}
    >
      <ImageWithText
        src={image}
        text={text}
        data-testid={`${dataTestId}-image-with-text`}
      />
      {cta && (
        <Button
          label={cta.label}
          onClick={cta.onClick}
          data-testid={`${dataTestId}-cta`}
        />
      )}
    </section>
  );
};
