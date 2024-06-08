import { type httpRouter } from './routers/http';
import { type wsRouter } from './routers/ws';

export { httpRouter } from './routers/http';
export type HttpRouter = typeof httpRouter;

export { wsRouter } from './routers/ws';
export type WSRouter = typeof wsRouter;
