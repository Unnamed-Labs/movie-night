export type ImageWithTextProps = {
  src: string;
  text: string;
  'data-testid'?: string;
};

export const ImageWithText = ({
  src,
  text,
  'data-testid': dataTestId = 'image-with-text',
}: ImageWithTextProps) => (
  <div
    className="ui-flex ui-flex-col ui-justify-center ui-items-center ui-gap-4"
    data-testid={dataTestId}
  >
    <img
      className="ui-rounded-lg"
      src={src}
      alt={text}
      width={279}
      height={279}
      data-testid={`${dataTestId}-img`}
    />
    <p
      className="ui-font-base ui-text-center ui-text-slate-50 ui-font-raleway"
      data-testid={`${dataTestId}-text`}
    >
      {text}
    </p>
  </div>
);
