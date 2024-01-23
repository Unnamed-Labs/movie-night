type RoomCodeProps = {
  code: string;
};

export const RoomCode = ({ code }: RoomCodeProps) => (
  <div className="font-raleway rounded-lg bg-slate-700 py-3 text-center text-4xl font-bold">
    {code}
  </div>
);
