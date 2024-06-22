import { RedisOptions } from "ioredis";
import { env } from "./env";

export const redisConfiguration: RedisOptions = {
  host: env.redis.host!,
  port: +env.redis.port!
}