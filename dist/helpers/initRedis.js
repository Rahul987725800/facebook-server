"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const redisClient = redis_1.default.createClient({
    host: process.env.REDIS_HOSTNAME,
    port: +process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});
redisClient.on('connect', () => {
    console.log('Client connected to redis...');
    redisClient.set('my goal', 'skartner');
});
exports.default = redisClient;
//# sourceMappingURL=initRedis.js.map