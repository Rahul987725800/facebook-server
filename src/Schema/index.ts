import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from './Mutations/Comment';
import { CREATE_LIKE, DELETE_LIKE } from './Mutations/Like';
import { CREATE_POST, UPDATE_POST, DELETE_POST } from './Mutations/Post';
import {
  CREATE_USER,
  DELETE_USER,
  LOGIN_USER,
  LOGOUT_USER,
  REFRESH_TOKEN,
  UPDATE_USER_PASSWORD,
} from './Mutations/User';
import { GET_ALL_POSTS, GET_POST } from './Queries/Post';
import { GET_ALL_USERS, GET_USER } from './Queries/User';
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getAllUsers: GET_ALL_USERS,
    getUser: GET_USER,
    getAllPosts: GET_ALL_POSTS,
    getPost: GET_POST,
  },
});
const MUTATION = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: CREATE_USER,
    loginUser: LOGIN_USER,
    logoutUser: LOGOUT_USER,
    updateUserPassword: UPDATE_USER_PASSWORD,
    deleteUser: DELETE_USER,
    refreshToken: REFRESH_TOKEN,
    createPost: CREATE_POST,
    updatePost: UPDATE_POST,
    deletePost: DELETE_POST,
    createComment: CREATE_COMMENT,
    updateComment: UPDATE_COMMENT,
    deleteComment: DELETE_COMMENT,
    createLike: CREATE_LIKE,
    deleteLike: DELETE_LIKE,
  },
});
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: MUTATION,
});
