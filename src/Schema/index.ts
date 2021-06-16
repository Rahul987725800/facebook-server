import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
} from './Mutations/Comment';
import { CREATE_LIKE, DELETE_LIKE } from './Mutations/Like';
import { CREATE_MESSAGE } from './Mutations/Message';
import { CREATE_POST, UPDATE_POST, DELETE_POST } from './Mutations/Post';
import { CREATE_ROOM } from './Mutations/Room';
import {
  CREATE_USER,
  DELETE_USER,
  LOGIN_USER,
  LOGOUT_USER,
  REFRESH_TOKEN,
  UPDATE_USER_PASSWORD,
} from './Mutations/User';
import { GET_ALL_POSTS, GET_POST } from './Queries/Post';
import { GET_ALL_ROOMS, GET_ROOM } from './Queries/Room';
import { GET_ALL_USERS, GET_USER, ME } from './Queries/User';
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getAllUsers: GET_ALL_USERS,
    getUser: GET_USER,
    me: ME,
    getAllPosts: GET_ALL_POSTS,
    getPost: GET_POST,
    getAllRooms: GET_ALL_ROOMS,
    getRoom: GET_ROOM,
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
    createMessage: CREATE_MESSAGE,
    createRoom: CREATE_ROOM,
  },
});
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: MUTATION,
});
