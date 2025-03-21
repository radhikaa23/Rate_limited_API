import Redis from 'ioredis';
import cluster from 'node:cluster';

let redisInstance;

/**
 * Function: getRedisInstance
 * ---------------------------
 * Retrieves a Redis instance, creating one if it doesn't exist and
 * ensuring it's only created in non-primary cluster workers.
 */


export const getRedisInstance = () => {

        if (!redisInstance && !cluster.isPrimary) {
            redisInstance = new Redis({
                host: 'redis',
                port: 6379,
              });
            console.log("Redis instance created")
        }
        return redisInstance;
};