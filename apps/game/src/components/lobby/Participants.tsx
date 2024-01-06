import { Participant } from '@movie/ui';
import type { User } from '@movie/api';

type ParticipantsProps = {
  participants: User[];
  amount: number;
};

export const Participants = ({ participants, amount }: ParticipantsProps) => (
  <div>
    <h2 className="pb-4 text-2xl font-bold">
      Participants {participants.length} / {amount}
    </h2>
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
