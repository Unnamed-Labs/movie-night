import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface TimerProps {
  initialTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
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
      setBackgroundColor('bg-green-400');
      setShimmerColor(
        'bg-gradient-to-tl from-transparent from-10% via-green-300 to-transparent to-90% opacity-75',
      );
    } else if (percentOfTimeLeft > 1 / 3) {
      setBackgroundColor('bg-amber-300');
      setShimmerColor(
        'bg-gradient-to-tl from-transparent from-10% via-amber-200 to-transparent to-90% opacity-75',
      );
    } else if (percentOfTimeLeft === 0) {
      setBackgroundColor('bg-gradient-to-tl from-rose-400 to-rose-300');
    } else {
      setBackgroundColor('bg-rose-400');
      setShimmerColor(
        'bg-gradient-to-tl from-transparent from-10% via-rose-300 to-transparent to-90% opacity-75',
      );
    }
  }, [timeRemaining, initialTime]);

  return (
    <div
      className={`relative flex items-center justify-center rounded-lg p-3 text-2xl font-semibold text-slate-900 ${backgroundColor} overflow-hidden`}
      data-testid="timer"
    >
      <motion.span
        className={`absolute left-0 top-0 z-[2] h-[200%] w-[200%] rounded-lg ${shimmerColor}`}
        initial={{ x: '-100%', y: '-100%' }}
        animate={controls}
        transition={{
          ease: 'easeIn',
          repeat: Infinity,
          duration: 1.5,
          repeatDelay: 3,
        }}
      />
      {timeRemaining} seconds
    </div>
  );
};

export default Timer;
