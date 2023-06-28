import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface TimerProps {
  initialTime: number;
}

export const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [shimmerColor, setShimmerColor] = useState('');

  const controls = useAnimationControls();

  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({ x: '50%', y: '50%' });
    };
    void startAnimation();
  }, [controls]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      controls.stop();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime === 0 ? 0 : prevTime - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, controls]);

  useEffect(() => {
    const percentOfTimeLeft = timeRemaining / initialTime;

    if (percentOfTimeLeft > 2 / 3) {
      setBackgroundColor('ui-bg-green-400');
      setShimmerColor(
        'ui-bg-gradient-to-tl ui-from-transparent ui-from-10% ui-via-green-300 ui-to-transparent ui-to-90% ui-opacity-75',
      );
    } else if (percentOfTimeLeft > 1 / 3) {
      setBackgroundColor('ui-bg-amber-300');
      setShimmerColor(
        'ui-bg-gradient-to-tl ui-from-transparent ui-from-10% ui-via-amber-200 ui-to-transparent ui-to-90% ui-opacity-75',
      );
    } else if (percentOfTimeLeft === 0) {
      setBackgroundColor('ui-bg-gradient-to-tl ui-from-rose-400 ui-to-rose-300');
    } else {
      setBackgroundColor('ui-bg-rose-400');
      setShimmerColor(
        'ui-bg-gradient-to-tl ui-from-transparent ui-from-10% ui-via-rose-300 ui-to-transparent ui-to-90% ui-opacity-75',
      );
    }
  }, [timeRemaining, initialTime]);

  return (
    <div
      className={`ui-relative ui-flex ui-items-center ui-justify-center ui-rounded-lg ui-p-3 ui-text-2xl ui-font-semibold ui-text-slate-900 ${backgroundColor} ui-overflow-hidden`}
      data-testid="timer"
    >
      <motion.span
        className={`ui-absolute ui-left-0 ui-top-0 ui-z-[2] ui-h-[200%] ui-w-[200%] ui-rounded-lg ${shimmerColor}`}
        initial={{ x: '-100%', y: '-100%' }}
        animate={controls}
        transition={{
          ease: 'easeIn',
          repeat: Infinity,
          duration: 1.5,
          repeatDelay: 5,
        }}
      />
      {timeRemaining} seconds
    </div>
  );
};
