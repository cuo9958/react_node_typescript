const Redis = require('ioredis');
const config = require('config');

module.exports = function() {
    const cluster = new Redis(config.redis, {
        reconnectOnError: function(err) {
            console.log('redis连接失败', err);
            return false;
        }
    });
    console.log('连接redis');
    return cluster;
};
