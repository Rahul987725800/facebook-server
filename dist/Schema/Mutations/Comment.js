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
exports.DELETE_COMMENT = exports.UPDATE_COMMENT = exports.CREATE_COMMENT = void 0;
const graphql_1 = require("graphql");
const types_1 = __importDefault(require("../types"));
const Comment_1 = __importDefault(require("../../models/Comment"));
const Post_1 = __importDefault(require("../../models/Post"));
exports.CREATE_COMMENT = {
    type: types_1.default.MessageType,
    args: {
        body: { type: graphql_1.GraphQLString },
        userId: { type: graphql_1.GraphQLID },
        postId: { type: graphql_1.GraphQLID },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findById(args.postId);
            if (post) {
                const comment = new Comment_1.default({
                    body: args.body,
                    user: args.userId,
                    post: args.postId,
                });
                yield comment.save();
                post.comments.push(comment);
                yield post.save();
                return {
                    message: 'comment created',
                };
            }
            else {
                return {
                    message: `wrong postId: ${args.postId}`,
                };
            }
        });
    },
};
exports.UPDATE_COMMENT = {
    type: types_1.default.MessageType,
    args: {
        id: { type: graphql_1.GraphQLID },
        body: { type: graphql_1.GraphQLString },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield Comment_1.default.findById(args.id);
            if (comment) {
                comment.body = args.body;
                yield comment.save();
                return {
                    message: `comment updated`,
                };
            }
            else {
                return {
                    message: `no comment exists with id ${args.id}`,
                };
            }
        });
    },
};
exports.DELETE_COMMENT = {
    type: types_1.default.MessageType,
    args: {
        id: { type: graphql_1.GraphQLID },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield Comment_1.default.findById(args.id);
            if (comment) {
                yield comment.delete();
                return {
                    message: `comment deleted`,
                };
            }
            else {
                return {
                    message: `no comment exists with id ${args.id}`,
                };
            }
        });
    },
};
//# sourceMappingURL=Comment.js.map