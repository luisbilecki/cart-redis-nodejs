const { isDev } = require('../helpers/env');

// In dev and prod env use ioredis, otherwise use its mock
const Redis = isDev() ? require('ioredis') : require('ioredis-mock');

const redis = new Redis(process.env.REDIS_URL);

module.exports = redis;
