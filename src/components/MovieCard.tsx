import { useEffect, useState } from 'react';
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
};

const MovieCard = ({ collapsible }: MovieCardProps) => {
  const [showDescription, setShowDescription] = useState<boolean>(!collapsible);
  const handleMoreInfoClick = () => {
    setShowDescription(!showDescription);
  };
  return (
    <motion.div
      className="flex w-full max-w-xs flex-col gap-2 rounded-lg bg-slate-700 p-4 text-slate-100 shadow-md shadow-black transition hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl hover:shadow-black"
      data-testid="movie-card"
    >
      <div className="flex flex-row items-center justify-between">
        <Image
          className="rounded-lg"
          src="/shrek.jpg"
          alt=""
          width={133}
          height={200}
        />
        <div className="flex h-full w-1/2 flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2 text-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-500 text-2xl drop-shadow-md">
              77
            </div>
            User score
          </div>
          <div>Hulu</div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-base">
          <strong>Shrek</strong>
        </p>
        <div className="flex flex-col gap-2 text-[0.75rem] text-slate-500">
          <div className="flex flex-row items-center gap-2">
            <span className="flex rounded border-2 border-slate-500 px-2 py-[2px]">PG</span>
            <span>05/18/2001</span>
            <span>(US)</span>
            <span>1h 30m</span>
          </div>
          <span>Animation, Comedy, Fantasy, Adventure, Family</span>
        </div>

        {
          <div className="mt-4 flex flex-col justify-center text-sm">
            {showDescription && (
              <p className="w-full">
                It ain&apos;t easy bein&apos; green -- especially if you&apos;re a likable (albeit
                smelly) ogre named Shrek. On a mission to retrieve a gorgeous princess from the
                clutches of a fire-breathing dragon, Shrek teams up with an unlikely compatriot -- a
                wisecracking donkey.
              </p>
            )}
            {collapsible && (
              <Button
                variant="standalone"
                onClick={handleMoreInfoClick}
              >
                {showDescription ? 'Hide info' : 'View info'}
              </Button>
            )}
          </div>
        }
      </div>
    </motion.div>
  );
};

export default MovieCard;
