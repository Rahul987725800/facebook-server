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
exports.DELETE_POST = exports.UPDATE_POST = exports.CREATE_POST = void 0;
const graphql_1 = require("graphql");
const types_1 = __importDefault(require("../types"));
const Post_1 = __importDefault(require("../../models/Post"));
const User_1 = __importDefault(require("../../models/User"));
exports.CREATE_POST = {
    type: types_1.default.MessageType,
    args: {
        body: { type: graphql_1.GraphQLString },
        userId: { type: graphql_1.GraphQLID },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findById(args.userId);
            if (user) {
                const newPost = new Post_1.default({
                    body: args.body,
                    user: user.id,
                });
                const savedPost = yield newPost.save();
                user.posts.push(savedPost);
                yield user.save();
                return {
                    message: `post created with id ${savedPost.id}`,
                };
            }
            return {
                message: `wrong userId: ${args.userId}`,
            };
        });
    },
};
exports.UPDATE_POST = {
    type: types_1.default.MessageType,
    args: {
        id: { type: graphql_1.GraphQLID },
        body: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findById(args.id);
            if (post) {
                post.body = args.body;
                yield post.save();
                return {
                    message: `post updated`,
                };
            }
            else {
                return {
                    message: `no post exists with id ${args.id}`,
                };
            }
        });
    },
};
exports.DELETE_POST = {
    type: types_1.default.MessageType,
    args: {
        id: { type: graphql_1.GraphQLID },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findById(args.id);
            if (post) {
                yield post.delete();
                return {
                    message: `post deleted`,
                };
            }
            else {
                return {
                    message: `no post exists with id ${args.id}`,
                };
            }
        });
    },
};
//# sourceMappingURL=Post.js.map