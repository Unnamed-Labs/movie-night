export type User = {
  id: string;
  name: string;
  isHost: boolean;
  accountId?: string;
  image?: {
    src: string;
    alt: string;
  };
};
