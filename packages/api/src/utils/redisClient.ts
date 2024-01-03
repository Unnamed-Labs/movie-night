import { Redis } from 'ioredis';
import { getRedisConnection } from './getRedisConnection';

export const client = new Redis(getRedisConnection());
