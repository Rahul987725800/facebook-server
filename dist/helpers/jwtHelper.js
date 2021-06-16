"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.signRefreshToken = exports.verifyAccessToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const initRedis_1 = __importDefault(require("./initRedis"));
exports.signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '1h',
            issuer: 'skartner.com',
            audience: userId,
        };
        jsonwebtoken_1.default.sign(payload, secret, options, (err, token) => {
            if (err) {
                return reject(new Error('InternalServerError'));
            }
            resolve(token);
        });
    });
};
exports.verifyAccessToken = (context) => {
    return new Promise((resolve, reject) => {
        const authHeader = context.req.headers['authorization'];
        if (!authHeader) {
            return reject(new Error('Authorization header not set'));
        }
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                console.log(err.name);
                if (err.name === 'TokenExpiredError') {
                    return reject(err);
                }
                else {
                    return reject(new Error('Invalid token'));
                }
            }
            context.payload = payload;
            resolve(payload);
        });
    });
};
exports.signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: '1y',
            issuer: 'skartner.com',
            audience: userId,
        };
        jsonwebtoken_1.default.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                return reject(new Error('InternalServerError'));
            }
            initRedis_1.default.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                if (err) {
                    console.log(err.message);
                    return reject(new Error('InternalServerError'));
                }
                resolve(token);
            });
        });
    });
};
exports.verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return reject(new Error('Invalid refreshToken exited after jwt validation'));
            }
            const userId = payload.aud;
            initRedis_1.default.GET(userId, (err, result) => {
                if (err) {
                    console.log(err.message);
                    return reject(new Error(`Error while getting refreshToken against ${userId} from database`));
                }
                if (refreshToken === result) {
                    return resolve(userId);
                }
                return reject(new Error("Provided refresh token does't match with refreshToken in Redis, although validated by jwt, new refresh token must be generated"));
            });
        });
    });
};
//# sourceMappingURL=jwtHelper.js.map