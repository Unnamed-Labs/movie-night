import { EventEmitter } from 'events';
import type { Participant } from '../types/Participant';

// TODO: Replace this with a Redis client

interface MyEvents {
  addParticipant: (data: Participant) => void;
  startGame: (roomId: string) => void;
  movieProposed: (roomId: string) => Promise<void>;
  movieVoted: (roomId: string) => Promise<void>;
}

declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(event: TEv, ...args: Parameters<MyEvents[TEv]>): boolean;
}

class MyEventEmitter extends EventEmitter {}

export const ee = new MyEventEmitter();
