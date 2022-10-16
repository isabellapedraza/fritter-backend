import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Nest
 */

// Type definition for Nest on the backend
export type Nest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  creatorId: Types.ObjectId;
  members: Types.ObjectId[];
  posts: Types.ObjectId[];
};

export type PopulatedNest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  creatorId: User;
  members: Types.ObjectId[];
  posts: Types.ObjectId[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Nests stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const NestSchema = new Schema({
  // The nest's name
  name: {
    type: String,
    required: true
  },
  // The nest's creator
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The nest's members
  members: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  // The nest's posts
  posts: {
    type: [Schema.Types.ObjectId],
    required: true
  }
});

const NestModel = model<Nest>('Nest', NestSchema);
export default NestModel;
