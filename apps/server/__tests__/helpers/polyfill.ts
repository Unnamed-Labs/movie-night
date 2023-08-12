import { WebSocket } from 'ws';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
globalThis.WebSocket = WebSocket as any;
