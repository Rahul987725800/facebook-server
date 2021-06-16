"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentType = void 0;
const graphql_1 = require("graphql");
const Post_1 = require("./Post");
exports.CommentType = new graphql_1.GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        body: { type: graphql_1.GraphQLString },
        post: { type: Post_1.PostType },
    }),
});
//# sourceMappingURL=Comment.js.map