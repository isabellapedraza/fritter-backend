// import type {Types, PopulatedDoc, Document} from 'mongoose';
// import {Schema, model} from 'mongoose';
// import type {User} from '../user/model';

// /**
//  * This file defines the properties stored in a Friend Request
//  * Inspired by https://stackoverflow.com/questions/43508901/friend-request-system-with-express-mongodb
//  * https://stackoverflow.com/questions/50363220/modelling-for-friends-schema-in-mongoose
//  */

// // Type definition for FriendRequest on the backend
// export type FriendRequest = {
//   requester: User; // MongoDB assigns each object this ID on creation
//   recipient: User;
//   status: number;
//   dateSent: Date;
// };

// // Mongoose schema definition for interfacing with a MongoDB table
// // FriendRequests stored in this table will have these fields, with the
// // type given by the type property, inside MongoDB
// const FriendRequestSchema = new Schema<FriendRequest>({
//   // The user that sent the request
//   requester: {
//     // Use Types.ObjectId outside of the schema
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   // The recipient of the friend request
//   recipient: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   // The status of the friend request
//   status: {
//     type: Number,
//     enums: [
//       0, // 'add friend'
//       1, // 'requested'
//       2, // 'pending'
//       3 // 'friends'
//     ],
//     required: true
//   },
//   // The date the friend request was sent
//   dateSent: {
//     type: Date,
//     required: true
//   }
// });

// const FriendRequestModel = model<FriendRequest>('FriendRequest', FriendRequestSchema);
// export default FriendRequestModel;

