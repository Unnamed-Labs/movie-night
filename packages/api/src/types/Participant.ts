export type Participant = {
  id: string;
  name: string;
  isHost: boolean;
  userId?: string;
  image?: {
    src: string;
    alt: string;
  };
};
