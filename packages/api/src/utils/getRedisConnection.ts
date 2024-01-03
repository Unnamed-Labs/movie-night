export const getRedisConnection = () => {
  const password = process.env.UPSTASH_REDIS_PASSWORD ? process.env.UPSTASH_REDIS_PASSWORD : '';
  const url = process.env.UPSTASH_REDIS_URL ? process.env.UPSTASH_REDIS_URL : '';

  if (!password || !url) {
    throw Error('upstash redis info missing');
  }

  return `rediss://default:${password}@${url}:30252`;
};
