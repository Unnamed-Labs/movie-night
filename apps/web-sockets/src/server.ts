import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { wsRouter } from '@movie/api';
import { createContext } from './context';

const dev = process.env.NODE_ENV === 'development';
const port = Number(process.env.WS_PORT) ?? 3001;

export function createServer() {
  const server = fastify({ logger: dev });

  void server.register(ws);
  void server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    useWSS: true,
    trpcOptions: { router: wsRouter, createContext },
  });

  const stop = async () => {
    await server.close();
  };
  const start = async () => {
    try {
      await server.listen({ port });
      console.log('listening on port', port);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}
