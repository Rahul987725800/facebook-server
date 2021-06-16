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
exports.DELETE_LIKE = exports.CREATE_LIKE = void 0;
const graphql_1 = require("graphql");
const types_1 = __importDefault(require("../types"));
const Like_1 = __importDefault(require("../../models/Like"));
const Post_1 = __importDefault(require("../../models/Post"));
exports.CREATE_LIKE = {
    type: types_1.default.MessageType,
    args: {
        userId: { type: graphql_1.GraphQLID },
        postId: { type: graphql_1.GraphQLID },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findById(args.postId);
            if (post) {
                const like = new Like_1.default({
                    user: args.userId,
                    post: args.postId,
                });
                yield like.save();
                post.likes.push(like);
                yield post.save();
                return {
                    message: 'like created',
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
exports.DELETE_LIKE = {
    type: types_1.default.MessageType,
    args: {
        id: { type: graphql_1.GraphQLID },
    },
    resolve(parent, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield Like_1.default.findById(args.id);
            if (like) {
                yield like.delete();
                return {
                    message: `like deleted`,
                };
            }
            else {
                return {
                    message: `no like exists with id ${args.id}`,
                };
            }
        });
    },
};
//# sourceMappingURL=Like.js.map