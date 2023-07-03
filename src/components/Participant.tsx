import React from 'react';

interface ParticipantProps {
  name: string;
  image: {
    src: string;
    alt: string;
  };
}

const Participant: React.FC<ParticipantProps> = ({ name, image }) => {
  return (
    <div
      className="flex w-full flex-row items-center gap-4 rounded-lg bg-slate-700 p-4 text-lg text-white shadow-md shadow-black "
      data-testid="participant"
    >
      <img
        className="h-12 w-12  rounded-full object-cover"
        src={image.src}
        alt={image.alt}
      />
      <span>{name}</span>
    </div>
  );
};

export default Participant;
