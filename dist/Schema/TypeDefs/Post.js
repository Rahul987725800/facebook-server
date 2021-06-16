"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostType = void 0;
const graphql_1 = require("graphql");
const Comment_1 = require("./Comment");
const Like_1 = require("./Like");
const User_1 = require("./User");
exports.PostType = new graphql_1.GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        body: { type: graphql_1.GraphQLString },
        user: { type: User_1.UserType },
        comments: { type: new graphql_1.GraphQLList(Comment_1.CommentType) },
        likes: { type: new graphql_1.GraphQLList(Like_1.LikeType) },
    }),
});
//# sourceMappingURL=Post.js.map