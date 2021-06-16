"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN = exports.DELETE_USER = exports.UPDATE_USER_PASSWORD = exports.LOGOUT_USER = exports.LOGIN_USER = exports.CREATE_USER = void 0;
const graphql_1 = require("graphql");
const bcrypt_1 = __importDefault(require("bcrypt"));
const types_1 = __importDefault(require("../types"));
const User_1 = __importDefault(require("../../models/User"));
const validationSchema_1 = require("../../helpers/validationSchema");
const jwtHelper_1 = require("../../helpers/jwtHelper");
const initRedis_1 = __importDefault(require("../../helpers/initRedis"));
exports.CREATE_USER = {
    type: types_1.default.PayloadType('CREATE_USER', {
        accessToken: { type: graphql_1.GraphQLString },
        refreshToken: { type: graphql_1.GraphQLString },
    }),
    args: {
        email: { type: graphql_1.GraphQLString },
        username: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield validationSchema_1.authSchema({}).validateAsync(args);
                const existingUserWithEmail = yield User_1.default.findOne({ email: result.email });
                if (existingUserWithEmail) {
                    throw new Error(`${result.email} is already registered`);
                }
                const hashedPassword = yield bcrypt_1.default.hash(result.password, 12);
                const user = new User_1.default({
                    email: result.email,
                    password: hashedPassword,
                    username: result.username,
                });
                yield user.save();
                const accessToken = yield jwtHelper_1.signAccessToken(user.id);
                const refreshToken = yield jwtHelper_1.signRefreshToken(user.id);
                return {
                    message: `user created with id ${user.id}`,
                    accessToken,
                    refreshToken,
                };
            }
            catch (err) {
                if (err.isJoi) {
                    return {
                        error: true,
                        message: err.details[0].message,
                    };
                }
                return {
                    error: true,
                    message: err.message,
                };
            }
        });
    },
};
exports.LOGIN_USER = {
    type: types_1.default.PayloadType('LOGIN_USER', {
        accessToken: { type: graphql_1.GraphQLString },
        refreshToken: { type: graphql_1.GraphQLString },
    }),
    args: {
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield validationSchema_1.authSchema({ username: false }).validateAsync(args);
                const user = yield User_1.default.findOne({ email: result.email });
                if (!user) {
                    throw new Error(`Email not registered`);
                }
                const valid = yield bcrypt_1.default.compare(result.password, user.password);
                if (!valid) {
                    throw new Error('wrong password');
                }
                const accessToken = yield jwtHelper_1.signAccessToken(user.id);
                const refreshToken = yield jwtHelper_1.signRefreshToken(user.id);
                return {
                    message: `logged in successfully userId: ${user.id}`,
                    accessToken,
                    refreshToken,
                };
            }
            catch (err) {
                if (err.isJoi) {
                    return {
                        error: true,
                        message: err.details[0].message,
                    };
                }
                return {
                    error: true,
                    message: err.message,
                };
            }
        });
    },
};
exports.LOGOUT_USER = {
    type: types_1.default.MessageType,
    args: {
        refreshToken: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!args.refreshToken) {
                    throw new Error('no refresh token');
                }
                const userId = yield jwtHelper_1.verifyRefreshToken(args.refreshToken);
                initRedis_1.default.DEL(userId, (err, val) => {
                    if (err) {
                        console.log(err.message);
                        throw new Error('Redis error while deleting refreshToken from redis db');
                    }
                    console.log(val);
                });
                return {
                    message: 'logged out successfully',
                };
            }
            catch (err) {
                return {
                    error: true,
                    message: err.message,
                };
            }
        });
    },
};
exports.UPDATE_USER_PASSWORD = {
    type: types_1.default.MessageType,
    args: {
        id: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        oldPassword: { type: graphql_1.GraphQLString },
        newPassword: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                if (args.email) {
                    user = yield User_1.default.findOne({
                        email: args.email,
                    });
                }
                else {
                    user = yield User_1.default.findById(args.id);
                }
                if (user) {
                    const valid = yield bcrypt_1.default.compare(args.oldPassword, user.password);
                    if (!valid) {
                        throw new Error('wrong password');
                    }
                    const result = yield validationSchema_1.authSchema({
                        email: false,
                        username: false,
                    }).validateAsync({
                        password: args.newPassword,
                    });
                    const hashedPassword = yield bcrypt_1.default.hash(result.password, 12);
                    user.password = hashedPassword;
                    yield user.save();
                    return {
                        message: 'password updated successfully',
                    };
                }
                else {
                    throw new Error(`no user exists with ${args.email ? `email: ${args.email}` : `id: ${args.id}`}`);
                }
            }
            catch (err) {
                if (err.isJoi) {
                    return {
                        error: true,
                        message: err.details[0].message,
                    };
                }
                return {
                    error: true,
                    message: err.message,
                };
            }
        });
    },
};
exports.DELETE_USER = {
    type: types_1.default.MessageType,
    args: {
        id: { type: graphql_1.GraphQLID },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findByIdAndDelete(args.id);
            if (user) {
                return {
                    message: 'deleted successfully',
                };
            }
            else {
                return {
                    message: `no user exists with id ${args.id}`,
                };
            }
        });
    },
};
exports.REFRESH_TOKEN = {
    type: types_1.default.PayloadType('REFRESH_TOKEN', {
        accessToken: { type: graphql_1.GraphQLString },
        refreshToken: { type: graphql_1.GraphQLString },
    }),
    args: {
        refreshToken: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!args.refreshToken) {
                    throw new Error('no refresh token');
                }
                const userId = (yield jwtHelper_1.verifyRefreshToken(args.refreshToken));
                const accessToken = yield jwtHelper_1.signAccessToken(userId);
                const newRefreshToken = yield jwtHelper_1.signRefreshToken(userId);
                return {
                    accessToken,
                    refreshToken: newRefreshToken,
                    message: 'refreshed token successfully',
                };
            }
            catch (err) {
                return {
                    error: true,
                    message: err.message,
                };
            }
        });
    },
};
//# sourceMappingURL=User.js.map