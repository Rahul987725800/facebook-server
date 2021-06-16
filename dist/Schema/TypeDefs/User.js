"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserType = void 0;
const Post_1 = require("./Post");
const graphql_1 = require("graphql");
exports.UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        posts: { type: graphql_1.GraphQLList(Post_1.PostType) },
    }),
});
//# sourceMappingURL=User.js.map