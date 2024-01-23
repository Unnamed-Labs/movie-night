import { useState } from 'react';

export type MovieCardProps = {
  title: string;
  runtime: string;
  date: string;
  image: {
    src: string;
    alt: string;
  };
  rating: string;
  user?: {
    src: string;
    alt: string;
  };
  disabled?: boolean;
  'data-testid'?: string;
  onClick?: () => void;
};

export const MovieCard = ({
  title,
  image,
  rating,
  date,
  runtime,
  disabled,
  user,
  'data-testid': dataTestId = 'movie-card',
  onClick,
}: MovieCardProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  const handleCardClick = () => {
    if (!disabled) {
      setSelected(!selected);
      if (onClick) {
        onClick();
      }
    }
  };

  const disabledClasses = disabled
    ? 'hover:ui-cursor-not-allowed'
    : 'hover:ui-cursor-pointer hover:-ui-translate-y-1 hover:ui-drop-shadow-xl';

  return (
    <div
      className={`ui-relative ui-flex ui-w-full ui-max-w-xs ui-flex-col ui-gap-2 ui-rounded-lg ui-bg-slate-700 ui-text-slate-50 ui-font-work-sans ui-drop-shadow-md ui-shadow-black ui-transition-all ${disabledClasses}`}
      title={title}
      data-testid={dataTestId}
      onClick={handleCardClick}
    >
      {disabled && (
        <div
          className="ui-absolute ui-left-0 ui-top-0 ui-z-10 ui-h-full ui-w-full ui-rounded-lg ui-bg-slate-900 ui-opacity-50"
          data-testid={`${dataTestId}-disabled-filter`}
        />
      )}
      {selected && (
        <div
          className="ui-absolute ui-left-0 ui-top-0 ui-z-10 ui-h-full ui-w-full ui-bg-slate-900 ui-opacity-15"
          data-testid={`${dataTestId}-selected-filter`}
        />
      )}
      {selected && user && (
        <img
          className="ui-absolute ui-right-[-16px] ui-top-[-16px] ui-z-20 ui-max-h-[48px] ui-max-w-[48px] ui-rounded-full"
          src={user.src}
          alt={user.alt}
          width={48}
          height={48}
          data-testid={`${dataTestId}-user`}
        />
      )}
      <img
        className="ui-rounded-lg"
        src={image.src}
        alt={image.alt}
        width={256}
        height={385}
        data-testid={`${dataTestId}-image`}
      />
      <div className="ui-flex ui-flex-col ui-gap-2 ui-px-2 ui-pb-2">
        <p
          className="ui-text-base"
          data-testid={`${dataTestId}-title`}
        >
          <strong>{title}</strong>
        </p>
        <div className="ui-flex ui-flex-row ui-items-center ui-gap-2 ui-text-[0.75rem] ui-text-slate-500">
          <span
            className="ui-flex ui-rounded ui-border-2 ui-border-slate-500 ui-px-2 ui-py-[2px]"
            data-testid={`${dataTestId}-rating`}
          >
            {rating}
          </span>
          <span data-testid={`${dataTestId}-date`}>{date}</span>
          <span>—</span>
          <span data-testid={`${dataTestId}-runtime`}>{runtime}</span>
        </div>
      </div>
    </div>
  );
};
