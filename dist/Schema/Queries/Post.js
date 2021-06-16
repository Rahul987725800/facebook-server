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
exports.GET_POST = exports.GET_ALL_POSTS = void 0;
const graphql_1 = require("graphql");
const jwtHelper_1 = require("../..//helpers/jwtHelper");
const Post_1 = __importDefault(require("../../models/Post"));
const types_1 = __importDefault(require("../types"));
exports.GET_ALL_POSTS = {
    type: types_1.default.PayloadType('GET_ALL_POSTS', {
        posts: { type: new graphql_1.GraphQLList(types_1.default.PostType) },
    }),
    resolve(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield jwtHelper_1.verifyAccessToken(context);
                const posts = yield Post_1.default.find().populate('user');
                return {
                    posts,
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
exports.GET_POST = {
    type: types_1.default.PostType,
    args: {
        id: {
            type: graphql_1.GraphQLID,
        },
    },
    resolve(parent, args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield jwtHelper_1.verifyAccessToken(context);
            const post = yield Post_1.default.findById(args.id)
                .populate('user')
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
            });
            return post;
        });
    },
};
//# sourceMappingURL=Post.js.map