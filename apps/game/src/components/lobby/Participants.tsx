import { Participant } from '@movie/ui';
import type { User } from '@movie/api';

type ParticipantsProps = {
  participants: {
    [key: string]: User;
  };
  amount: number;
};

export const Participants = ({ participants, amount }: ParticipantsProps) => (
  <div>
    <h2 className="font-raleway pb-4 text-2xl">
      participants {Object.keys(participants).length} / {amount}
    </h2>
    <div className="flex flex-col gap-4">
      {participants &&
        Object.keys(participants) &&
        Object.keys(participants).map((key, idx) => (
          <Participant
            key={idx}
            name={participants[key].name}
            image={participants[key].image}
          />
        ))}
    </div>
  </div>
);
