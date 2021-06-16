"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeType = void 0;
const graphql_1 = require("graphql");
const Post_1 = require("./Post");
exports.LikeType = new graphql_1.GraphQLObjectType({
    name: 'Like',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        post: { type: Post_1.PostType },
    }),
});
//# sourceMappingURL=Like.js.map