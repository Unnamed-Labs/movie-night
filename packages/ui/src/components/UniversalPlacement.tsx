import { type Image } from '../types/Image';
import { type Button as ButtonType } from '../types/Button';
import { Button } from './Button';

export type UniversalPlacementProps = {
  heading: string;
  description: string;
  image: Image;
  primary?: ButtonType;
  secondary?: ButtonType;
  'data-testid'?: string;
};

export const UniversalPlacement = ({
  heading,
  description,
  image,
  primary,
  secondary,
  'data-testid': dataTestId = 'universal-placement',
}: UniversalPlacementProps) => (
  <section
    className="ui-flex ui-max-w-[343px] ui-flex-col ui-justify-center ui-items-center ui-gap-12 ui-text-slate-50"
    data-testid={dataTestId}
  >
    <img
      className="ui-w-full ui-h-[343px] ui-rounded-lg"
      src={image.src}
      alt={image.alt}
      data-testid={`${dataTestId}-img`}
    />
    <div className="ui-flex ui-flex-col ui-justify-center ui-items-center ui-gap-8">
      <h1
        className="ui-w-full ui-font-raleway ui-text-5xl ui-text-center md:text-6xl xl:text-7xl"
        data-testid={`${dataTestId}-heading`}
      >
        {heading}
      </h1>
      <p
        className="ui-w-full ui-font-work-sans ui-font-base ui-text-center"
        data-testid={`${dataTestId}-description`}
      >
        {description}
      </p>
      <div className="ui-flex ui-flex-row ui-justify-center ui-gap-8">
        {primary && (
          <Button
            variant="primary"
            label={primary.label}
            data-testid={`${dataTestId}-primary`}
            onClick={primary.onClick}
          />
        )}
        {primary && secondary && (
          <Button
            variant="secondary"
            label={secondary.label}
            data-testid={`${dataTestId}-secondary`}
            onClick={secondary.onClick}
          />
        )}
      </div>
    </div>
  </section>
);
