import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('Redis Connected Successfully');
});

if (!redis.isOpen) {
  redis.connect().catch(console.error);
}

export default redis;
export { redis };