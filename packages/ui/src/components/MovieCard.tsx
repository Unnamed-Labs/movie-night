import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

type MovieCardProps = {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  score: number;
  rating: string;
  date: string;
  location: string;
  runtime: string;
  categories: string[];
  description: string;
  streaming?: string;
  collapsible?: boolean;
  selectable?: boolean;
  disabled?: boolean;
};

export const MovieCard = ({
  title,
  image,
  score,
  rating,
  date,
  location,
  runtime,
  categories,
  description,
  streaming,
  collapsible,
  selectable,
  disabled,
}: MovieCardProps) => {
  const [showDescription, setShowDescription] = useState<boolean>(!collapsible);
  const [selected, setSelected] = useState<boolean>(false);

  const handleMoreInfoClick = () => {
    setShowDescription(!showDescription);
  };
  const handleCardClick = () => {
    if (selectable) {
      setSelected(!selected);
    }
  };

  const cats = categories.join(', ');
  const variants = {
    hidden: {
      opacity: 0,
      maxHeight: 0,
    },
    visible: {
      opacity: 1,
      maxHeight: 1000,
    },
  };
  const selectableClasses =
    selectable && !disabled
      ? 'ui-transition hover:ui--translate-y-1 hover:ui-cursor-pointer hover:ui-shadow-xl'
      : '';
  const selectedClasses = selected
    ? 'ui-shadow-md ui-shadow-purple-300 hover:ui-shadow-purple-300'
    : 'ui-shadow-md ui-shadow-black hover:ui-shadow-black';

  return (
    <div
      className={`ui-relative ui-flex ui-w-full ui-max-w-xs ui-flex-col ui-gap-2 ui-rounded-lg ui-bg-slate-700 ui-p-4 ui-text-slate-100 ui-shadow-md ui-shadow-black ${selectableClasses} ${selectedClasses}`}
      data-testid="movie-card"
      onClick={handleCardClick}
    >
      {disabled && (
        <div className="ui-absolute ui-left-0 ui-top-0 ui-z-10 ui-h-full ui-w-full ui-bg-slate-900 ui-opacity-70" />
      )}
      <div className="ui-flex ui-flex-row ui-items-center ui-justify-between">
        <img
          className="ui-rounded-lg"
          src={image.src}
          alt={image.alt}
          width={133}
          height={200}
          data-testid="movie-card-image"
        />
        <div className="ui-flex ui-h-full ui-w-1/2 ui-flex-col ui-items-center ui-justify-center ui-gap-4">
          <div className="ui-flex ui-flex-col ui-items-center ui-justify-center ui-gap-2 ui-text-sm">
            <div
              className="ui-flex ui-h-16 ui-w-16 ui-items-center ui-justify-center ui-rounded-full ui-bg-slate-500 ui-text-2xl ui-drop-shadow-md"
              data-testid="movie-card-score"
            >
              {score}
            </div>
            User score
          </div>
          {streaming && <div data-testid="movie-card-streaming">{streaming}</div>}
        </div>
      </div>
      <div>
        <p
          className="ui-mb-2 ui-text-base"
          data-testid="movie-card-title"
        >
          <strong>{title}</strong>
        </p>
        <div className="ui-flex ui-flex-col ui-gap-2 ui-text-[0.75rem] ui-text-slate-500">
          <div className="ui-flex ui-flex-row ui-items-center ui-gap-2">
            <span
              className="ui-flex ui-rounded ui-border-2 ui-border-slate-500 ui-px-2 ui-py-[2px]"
              data-testid="movie-card-rating"
            >
              {rating}
            </span>
            <span data-testid="movie-card-date">{date}</span>
            <span data-testid="movie-card-location">&#40;{location}&#41;</span>
            <span data-testid="movie-card-runtime">{runtime}</span>
          </div>
          <span data-testid="movie-card-categories">{cats}</span>
        </div>

        <div className="ui-mt-4 ui-flex ui-flex-col ui-items-center ui-justify-center ui-text-sm">
          <motion.p
            className="ui-w-full ui-max-h-0 ui-overflow-hidden"
            variants={variants}
            animate={showDescription ? 'visible' : 'hidden'}
            transition={{
              ease: 'easeInOut',
              duration: 1,
            }}
            data-testid="movie-card-description"
          >
            {description}
          </motion.p>
          {collapsible && (
            <Button
              variant="standalone"
              onClick={handleMoreInfoClick}
              data-testid="movie-card-info-btn"
            >
              {showDescription ? 'Hide info' : 'View info'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
