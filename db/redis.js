import bluebird from "bluebird";
import redis from "redis";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(process.env.REDIS_URL);

client.on("connect", () => {
  console.log("Redis connected");
});

export default client;
