import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

const types = {
  UserType: new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: GraphQLID },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      posts: { type: GraphQLList(getType('post')) },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    }),
  }),

  PostType: new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
      id: { type: GraphQLID },
      body: { type: GraphQLString },
      user: { type: getType('user') },
      comments: { type: new GraphQLList(getType('comment')) },
      likes: { type: new GraphQLList(getType('like')) },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    }),
  }),
  CommentType: new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
      id: { type: GraphQLID },
      body: { type: GraphQLString },
      user: { type: getType('user') },
      post: { type: getType('post') },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    }),
  }),
  LikeType: new GraphQLObjectType({
    name: 'Like',
    fields: () => ({
      id: { type: GraphQLID },
      user: { type: getType('user') },
      post: { type: getType('post') },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    }),
  }),
  MessageType: new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
      message: { type: GraphQLString },
      error: { type: GraphQLBoolean },
    }),
  }),
  PayloadType: (name: string, payload: object) =>
    new GraphQLObjectType({
      name: 'PAYLOAD_' + name,
      fields: () => ({
        message: { type: GraphQLString },
        error: { type: GraphQLBoolean },
        ...payload,
      }),
    }),
};
const getType = (type: 'user' | 'post' | 'comment' | 'like'): any => {
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
export default types;
