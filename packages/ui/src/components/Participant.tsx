import React from 'react';

interface ParticipantProps {
  name: string;
  image?: {
    src: string;
    alt: string;
  };
}

export const Participant: React.FC<ParticipantProps> = ({ name, image }) => {
  return (
    <div
      className="ui-flex ui-w-full ui-flex-row ui-items-center ui-gap-4 ui-rounded-lg ui-bg-slate-700 ui-p-4 ui-text-lg ui-text-slate-100 ui-shadow-md ui-shadow-black "
      data-testid="participant"
    >
      {image && (
        <img
          className="ui-h-12 ui-w-12 ui-rounded-full ui-object-cover"
          src={image.src}
          alt={image.alt}
        />
      )}
      <span>{name}</span>
    </div>
  );
};
