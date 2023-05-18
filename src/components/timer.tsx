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
      scale: [1, 1.5, 1],
      transition: {
        duration: 0.5,
        times: [0, 0.5, 1],
      },
    });
  }, [timeRemaining, timerControls]);

  const seconds = timeRemaining;

  return (
    <div className={`flex-col items-center justify-center rounded px-20 py-3 ${backgroundColor}`}>
      <motion.div
        className="text-6xl font-bold text-black"
        animate={timerControls}
      >
        {seconds.toString().padStart(2, '0')} Seconds
      </motion.div>
    </div>
  );
};

export default Timer;
