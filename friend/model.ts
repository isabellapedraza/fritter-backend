import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Friend
 */

// Type definition for Friend on the backend
export type Friend = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  friends: Types.ObjectId[];
};

export type PopulatedFriend = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  friends: Types.ObjectId[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Friends stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FriendSchema = new Schema<Friend>({
  // The root user
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The root user's friends
  friends: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

const FriendModel = model<Friend>('Friend', FriendSchema);
export default FriendModel;

