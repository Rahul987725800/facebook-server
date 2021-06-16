"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const Comment_1 = require("./Mutations/Comment");
const Like_1 = require("./Mutations/Like");
const Post_1 = require("./Mutations/Post");
const User_1 = require("./Mutations/User");
const Post_2 = require("./Queries/Post");
const User_2 = require("./Queries/User");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getAllUsers: User_2.GET_ALL_USERS,
        getUser: User_2.GET_USER,
        getAllPosts: Post_2.GET_ALL_POSTS,
        getPost: Post_2.GET_POST,
        me: User_2.ME,
    },
});
const MUTATION = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: User_1.CREATE_USER,
        loginUser: User_1.LOGIN_USER,
        logoutUser: User_1.LOGOUT_USER,
        updateUserPassword: User_1.UPDATE_USER_PASSWORD,
        deleteUser: User_1.DELETE_USER,
        refreshToken: User_1.REFRESH_TOKEN,
        createPost: Post_1.CREATE_POST,
        updatePost: Post_1.UPDATE_POST,
        deletePost: Post_1.DELETE_POST,
        createComment: Comment_1.CREATE_COMMENT,
        updateComment: Comment_1.UPDATE_COMMENT,
        deleteComment: Comment_1.DELETE_COMMENT,
        createLike: Like_1.CREATE_LIKE,
        deleteLike: Like_1.DELETE_LIKE,
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: MUTATION,
});
//# sourceMappingURL=index.js.map