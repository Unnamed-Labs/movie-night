import { type httpRouter } from './router/http';
import { type wsRouter } from './router/ws';

export { httpRouter } from './router/http';
export type HttpRouter = typeof httpRouter;

export { wsRouter } from './router/ws';
export type WSRouter = typeof wsRouter;
