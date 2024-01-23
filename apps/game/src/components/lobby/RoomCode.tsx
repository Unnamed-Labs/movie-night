type RoomCodeProps = {
  code: string;
};

export const RoomCode = ({ code }: RoomCodeProps) => (
  <div className="font-raleway w-full max-w-xs rounded-lg bg-slate-700 py-4 text-center text-4xl font-bold">
    {code}
  </div>
);
