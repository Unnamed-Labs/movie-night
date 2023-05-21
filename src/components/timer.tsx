import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TimerProps {
  initialTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [backgroundColor, setBackgroundColor] = useState('bg-green-400');

  const timerControls = useAnimation();

  useEffect(() => {
    if (timeRemaining === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  useEffect(() => {
    if (timeRemaining <= 30) {
      setBackgroundColor('bg-rose-400');
    } else if (timeRemaining <= 100) {
      setBackgroundColor('bg-amber-300');
    }
  }, [timeRemaining]);

  useEffect(() => {
    timerControls.start({
      transition: {
        duration: 1,
        ease: [0.17, 0.67, 0.83, 0.67],
      },
    });
  }, [timeRemaining, timerControls]);

  const seconds = timeRemaining;

  return (
    <div className={`rounded-lg ${backgroundColor}`}>
      <motion.div
        className=" flex min-w-[500px] items-center justify-center py-3 text-6xl font-semibold text-slate-900 transition-colors"
        animate={timerControls}
      >
        {seconds.toString().padStart(2, '0')} Seconds
      </motion.div>
    </div>
  );
};

export default Timer;
