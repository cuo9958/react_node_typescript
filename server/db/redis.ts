import Redis from "ioredis";
import config from "config";

export function getRedis() {
    const cluster = new Redis(config.redis, {
        reconnectOnError: function(err) {
            console.log("redis连接失败", err);
            return false;
        }
    });
    console.log("连接redis");
    return cluster;
}
