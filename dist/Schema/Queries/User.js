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
exports.ME = exports.GET_USER = exports.GET_ALL_USERS = void 0;
const graphql_1 = require("graphql");
const Post_1 = __importDefault(require("../../models/Post"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const User_1 = __importDefault(require("../../models/User"));
const types_1 = __importDefault(require("../types"));
exports.GET_ALL_USERS = {
    type: new graphql_1.GraphQLList(types_1.default.UserType),
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.default.find();
            return users;
        });
    },
};
exports.GET_USER = {
    type: types_1.default.UserType,
    args: {
        id: {
            type: graphql_1.GraphQLID,
        },
        email: {
            type: graphql_1.GraphQLString,
        },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (args.id) {
                user = yield User_1.default.findById(args.id);
            }
            else if (args.email) {
                user = yield User_1.default.findOne({
                    email: args.email,
                });
            }
            return user;
        });
    },
};
exports.ME = {
    type: types_1.default.UserType,
    resolve(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield jwtHelper_1.verifyAccessToken(context);
            const user = yield User_1.default.findById(context.payload.aud);
            const postIds = user.posts;
            const posts = postIds.map((id) => Post_1.default.findById(id)
                .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                },
            })
                .populate({
                path: 'likes',
                populate: {
                    path: 'user',
                },
            }));
            const result = {};
            for (let key in user) {
                result[key] = user[key];
            }
            result.posts = posts;
            return result;
        });
    },
};
//# sourceMappingURL=User.js.map