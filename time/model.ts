import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Nest} from '../nest/model';

/**
 * This file defines the properties stored in a Time
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Time on the backend
export type Time = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: Types.ObjectId;
  groupId: Types.ObjectId;
  startTime: string;
  endTime: string;
};

export type PopulatedTime = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: User;
  groupId: Nest;
  startTime: string;
  endTime: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Times stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const TimeSchema = new Schema<Time>({
  // The creator's userId
  creatorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The group the time is for
  groupId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Nest'
  },
  // The start time of the time
  startTime: {
    type: String,
    required: true
  },
  // The end time of the time
  endTime: {
    type: String,
    required: true
  }
});

const TimeModel = model<Time>('Time', TimeSchema);
export default TimeModel;
