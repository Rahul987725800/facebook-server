import redis from 'redis';
const redisClient = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
});
redisClient.on('connect', () => {
  console.log('Client connected to redis...');
});
export default redisClient;
