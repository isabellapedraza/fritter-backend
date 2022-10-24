import type {HydratedDocument, Types} from 'mongoose';
import type {Friend} from './model';
import FriendModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore friends
 * stored in MongoDB, including creating, removing, seeing suggested, and seeing mutual friends.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Friend> is the output of the FriendModel() constructor,
 * and contains all the information in Friend. https://mongoosejs.com/docs/typescript.html
 */
class FriendCollection {
  /**
   * Add a user to the collection
   *
   * @param {string} user - The id of the user
   * @return {Promise<HydratedDocument<Friend>>} - The newly created friend
   */
  static async addOne(user: Types.ObjectId | string, friends: Types.ObjectId[]): Promise<HydratedDocument<Friend>> {
    const friend = new FriendModel({
      user,
      friends
    });

    await friend.save();
    return friend;
  }

  /**
   * Get all the friends in by given user
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<Friend>[]>} - An array of all of their friends
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Friend>>> {
    const user = await UserCollection.findOneByUsername(username);
    return FriendModel.find({user: user._id}).populate('user');
  }

  /**
   * Get all the mutual friends between two users
   *
   * @param {string} userA - The id of the first user
   * @param {string} username - The username of the second user
   * @return {Promise<Types.ObjectId[]>} - An array of all of their mutual friends
   */
  static async findMutualFriends(userA: Types.ObjectId | string, username: string): Promise<Types.ObjectId[]> {
    const userB = await UserCollection.findOneByUsername(username);
    const friendA = await FriendModel.findOne({user: userA});
    const friendB = await FriendModel.findOne({user: userB._id});

    const mutuals = [];

    for (const friend of friendA.friends) {
      if (friendB.friends.includes(friend)) {
        mutuals.push(friend);
      }
    }

    return mutuals;
  }

  /**
   * Get all the suggested friends between two users
   *
   * @param {string} userA - The id of the first user
   * @param {string} userB - The id of the second user
   * @return {Promise<Types.ObjectId[]>} - An array of all of their suggested friends
   */
  static async findSuggestedFriends(userA: Types.ObjectId | string, username: string): Promise<Types.ObjectId[]> {
    const userB = await UserCollection.findOneByUsername(username);
    const friendA = await FriendModel.findOne({user: userA});
    const friendB = await FriendModel.findOne({user: userB._id});

    const suggested = [];

    for (const friend of friendA.friends) {
      if (!friendB.friends.includes(friend)) {
        suggested.push(friend);
      }
    }

    return suggested;
  }

  /**
   * Get all the friends in the database
   *
   * @return {Promise<HydratedDocument<Friend>[]>} - An array of all of the friends
   */
  static async findAll(): Promise<Array<HydratedDocument<Friend>>> {
    // Retrieves friends
    return FriendModel.find({}).populate('user');
  }

  /**
   * Update a friend with new friends
   *
   * @param {string} requesterId - The id of the requester
   * @param {string} username - The username of the recipient
   * @param {boolean} operation - Whether to add or remove
   * @return {Promise<HydratedDocument<Friend>>} - The newly updated friend
   */
  static async updateOne(requesterId: Types.ObjectId | string, username: string, operation: string): Promise<HydratedDocument<Friend>> {
    const recipient = await UserCollection.findOneByUsername(username);
    const requester = await UserCollection.findOneByUserId(requesterId);

    const friendA = await FriendModel.findOne({user: requesterId});
    const friendB = await FriendModel.findOne({user: recipient._id});

    const check = 'add';
    const add = check === operation.toLowerCase();

    if (add) {
      friendA.friends.push(recipient._id);
      friendB.friends.push(requester._id);
    } else {
      const indexA = friendA.friends.indexOf(recipient._id);
      if (indexA !== -1) {
        friendA.friends.splice(indexA, 1);
      }

      const indexB = friendB.friends.indexOf(requester._id);
      if (indexB !== -1) {
        friendB.friends.splice(indexB, 1);
      }
    }

    await friendA.save();
    await friendB.save();
    return friendA.populate('user');
  }

  /**
   * Delete all the friends by the given user
   *
   * @param {string} userId - The id of user
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await FriendModel.deleteMany({userId});
  }
}

export default FriendCollection;
