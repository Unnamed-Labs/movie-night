import React from 'react';
import { useEffect, useState } from 'react';

interface ParticipantProps {
  name: string;
  image: {
    src: string;
    alt: string;
  };
}

const Participant: React.FC<ParticipantProps> = ({ name, image }) => {
  return (
    <div className="flex h-20 max-w-md rounded-lg bg-slate-700 p-2 text-2xl text-white ">
      <img
        className="ml-2 mr-2 h-auto max-h-16 w-auto rounded-full object-contain"
        src={image.src}
        alt={image.alt}
      />
      <span className="p-3">{name}</span>
    </div>
  );
};

export default Participant;
