const { isTest } = require('../helpers/env');

// In dev and prod env use ioredis, otherwise use its mock
const Redis = isTest() ? require('ioredis-mock') : require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

module.exports = redis;
