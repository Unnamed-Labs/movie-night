import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from './global/Button';

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

const MovieCard = ({
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
      ? 'transition hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl'
      : '';
  const selectedClasses = selected
    ? 'shadow-md shadow-purple-300 hover:shadow-purple-300'
    : 'shadow-md shadow-black hover:shadow-black';

  return (
    <div
      className={`relative flex w-full max-w-xs flex-col gap-2 rounded-lg bg-slate-700 p-4 text-slate-100 shadow-md shadow-black ${selectableClasses} ${selectedClasses}`}
      data-testid="movie-card"
      onClick={handleCardClick}
    >
      {disabled && (
        <div className="absolute left-0 top-0 z-10 h-full w-full bg-slate-900 opacity-70" />
      )}
      <div className="flex flex-row items-center justify-between">
        <Image
          className="rounded-lg"
          src={image.src}
          alt={image.alt}
          width={133}
          height={200}
          data-testid="movie-card-image"
        />
        <div className="flex h-full w-1/2 flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2 text-sm">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-500 text-2xl drop-shadow-md"
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
          className="mb-2 text-base"
          data-testid="movie-card-title"
        >
          <strong>{title}</strong>
        </p>
        <div className="flex flex-col gap-2 text-[0.75rem] text-slate-500">
          <div className="flex flex-row items-center gap-2">
            <span
              className="flex rounded border-2 border-slate-500 px-2 py-[2px]"
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

        <div className="mt-4 flex flex-col items-center justify-center text-sm">
          <motion.p
            className="w-full overflow-hidden"
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

export default MovieCard;
