import { createClient } from 'redis';
import env from './env';

const redisUrl = `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`;
export const redisClient = createClient({ url: redisUrl });


