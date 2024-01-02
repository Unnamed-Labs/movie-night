type RoomCodeProps = {
  code: string;
};

export const RoomCode = ({ code }: RoomCodeProps) => (
  <div className="rounded-lg bg-slate-700 py-3 text-center text-2xl">{code}</div>
);
