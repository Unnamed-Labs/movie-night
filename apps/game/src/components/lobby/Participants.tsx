import { Participant } from '@movie/ui';

const participants = [
  {
    name: 'Viglante',
    image: {
      src: '/meow.jpg',
      alt: 'cute ass cat',
    },
  },
  {
    name: 'Depthcharge23',
    image: {
      src: '/saitaang.jpg',
      alt: 'aang drawing on saitama',
    },
  },
  {
    name: 'TacoRave',
    image: {
      src: './taco-rave.png',
      alt: 'taco rave',
    },
  },
];

export const Participants = () => (
  <div>
    <h2 className="pb-4 text-2xl font-bold">Participants</h2>
    <div className="flex flex-col gap-4">
      {participants.map((participant, idx) => (
        <Participant
          key={idx}
          name={participant.name}
          image={participant.image}
        />
      ))}
    </div>
  </div>
);
