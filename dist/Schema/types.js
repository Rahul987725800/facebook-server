"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const types = {
    UserType: new graphql_1.GraphQLObjectType({
        name: 'User',
        fields: () => ({
            id: { type: graphql_1.GraphQLID },
            username: { type: graphql_1.GraphQLString },
            email: { type: graphql_1.GraphQLString },
            posts: { type: graphql_1.GraphQLList(getType('post')) },
            createdAt: { type: graphql_1.GraphQLString },
            updatedAt: { type: graphql_1.GraphQLString },
        }),
    }),
    PostType: new graphql_1.GraphQLObjectType({
        name: 'Post',
        fields: () => ({
            id: { type: graphql_1.GraphQLID },
            body: { type: graphql_1.GraphQLString },
            user: { type: getType('user') },
            comments: { type: new graphql_1.GraphQLList(getType('comment')) },
            likes: { type: new graphql_1.GraphQLList(getType('like')) },
            createdAt: { type: graphql_1.GraphQLString },
            updatedAt: { type: graphql_1.GraphQLString },
        }),
    }),
    CommentType: new graphql_1.GraphQLObjectType({
        name: 'Comment',
        fields: () => ({
            id: { type: graphql_1.GraphQLID },
            body: { type: graphql_1.GraphQLString },
            user: { type: getType('user') },
            post: { type: getType('post') },
            createdAt: { type: graphql_1.GraphQLString },
            updatedAt: { type: graphql_1.GraphQLString },
        }),
    }),
    LikeType: new graphql_1.GraphQLObjectType({
        name: 'Like',
        fields: () => ({
            id: { type: graphql_1.GraphQLID },
            user: { type: getType('user') },
            post: { type: getType('post') },
            createdAt: { type: graphql_1.GraphQLString },
            updatedAt: { type: graphql_1.GraphQLString },
        }),
    }),
    MessageType: new graphql_1.GraphQLObjectType({
        name: 'Message',
        fields: () => ({
            message: { type: graphql_1.GraphQLString },
            error: { type: graphql_1.GraphQLBoolean },
        }),
    }),
    PayloadType: (name, payload) => new graphql_1.GraphQLObjectType({
        name: 'PAYLOAD_' + name,
        fields: () => (Object.assign({ message: { type: graphql_1.GraphQLString }, error: { type: graphql_1.GraphQLBoolean } }, payload)),
    }),
};
const getType = (type) => {
    switch (type) {
        case 'user':
            return types.UserType;
        case 'post':
            return types.PostType;
        case 'comment':
            return types.CommentType;
        case 'like':
            return types.LikeType;
    }
};
exports.default = types;
//# sourceMappingURL=types.js.map