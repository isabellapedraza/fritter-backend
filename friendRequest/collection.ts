// import type {HydratedDocument, Types} from 'mongoose';
// import type {FriendRequest} from './model';
// import FriendRequestModel from './model';
// import UserCollection from '../user/collection';

// /**
//  * This files contains a class that has the functionality to explore friend requests
//  * stored in MongoDB, including sending, accepting, rejecting friend requests.
//  * Feel free to add additional operations in this file.
//  *
//  * Note: HydratedDocument<FriendRequest> is the output of the FriendRequestModel() constructor,
//  * and contains all the information in FriendRequest. https://mongoosejs.com/docs/typescript.html
//  */
// class FriendRequestCollection {
//   /**
//    * Add a friend request to the collection
//    *
//    * @param {string} requester - The id of the author of the friend request
//    * @param {string} recipient - The id of the content of the friend request
//    * @param {string} status - The status of the friend request
//    * @return {Promise<HydratedDocument<FriendRequest>>} - The newly created friend request
//    */
//   static async addOne(requester: string, recipient: string, status: number): Promise<HydratedDocument<FriendRequest>> {
//     const friendRequest = FriendRequestModel.find({requester, recipient});
    
    
//     const friendRequest = new FriendRequestModel({
//       requester,
//       recipient,
//       status
//     });
//     await friendRequest.save(); // Saves friend request to MongoDB
//     return friendRequest;
//   }

//   /**
//    * Get all the freets in the database
//    *
//    * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
//    */
//   static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
//     // Retrieves freets and sorts them from most to least recent
//     return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
//   }

//   /**
//    * Get all the freets in by given author
//    *
//    * @param {string} username - The username of author of the freets
//    * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
//    */
//   static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
//     const author = await UserCollection.findOneByUsername(username);
//     return FreetModel.find({authorId: author._id}).populate('authorId');
//   }

//   /**
//    * Update a freet with the new content
//    *
//    * @param {string} freetId - The id of the freet to be updated
//    * @param {string} content - The new content of the freet
//    * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
//    */
//   static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
//     const freet = await FreetModel.findOne({_id: freetId});
//     freet.content = content;
//     freet.dateModified = new Date();
//     await freet.save();
//     return freet.populate('authorId');
//   }

//   /**
//    * Delete a freet with given freetId.
//    *
//    * @param {string} freetId - The freetId of freet to delete
//    * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
//    */
//   static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
//     const freet = await FreetModel.deleteOne({_id: freetId});
//     return freet !== null;
//   }

//   /**
//    * Delete all the freets by the given author
//    *
//    * @param {string} authorId - The id of author of freets
//    */
//   static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
//     await FreetModel.deleteMany({authorId});
//   }
// }

// export default FreetCollection;
