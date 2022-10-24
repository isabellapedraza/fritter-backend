import type {HydratedDocument, PopulatedDoc, Types} from 'mongoose';
import type {Nest} from './model';
import NestModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import TimeCollection from '../time/collection';

/**
 * This files contains a class that has the functionality to explore nests
 * stored in MongoDB, including adding, finding, updating, and deleting nests.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Nest> is the output of the NestModel() constructor,
 * and contains all the information in Nest. https://mongoosejs.com/docs/typescript.html
 */
class NestCollection {
  /**
   * Add a nest to the collection
   *
   * @param {string} creatorId - The creator of the nest
   * @param {string} name - The name of the nest
   * @return {Promise<HydratedDocument<Nest>>} - The newly created nest
   */
  static async addOne(creatorId: Types.ObjectId | string, name: string, members: Types.ObjectId[], posts: Types.ObjectId[]): Promise<HydratedDocument<Nest>> {
    const nest = new NestModel({
      creatorId,
      name,
      members,
      posts
    });

    await nest.save(); // Saves nest to MongoDB
    return nest.populate('creatorId');
  }

  /**
   * Find a nest by nestId
   *
   * @param {string} nestId - The id of the nest to find
   * @return {Promise<HydratedDocument<Nest>> | Promise<null> } - The nest with the given nestId, if any
   */
  static async findOne(nestId: Types.ObjectId | string): Promise<HydratedDocument<Nest>> {
    return NestModel.findOne({_id: nestId}).populate('creatorId');
  }

  /**
   * Get all the nests in by given creator
   *
   * @param {string} username - The username of author of the nests
   * @return {Promise<HydratedDocument<Nest>[]>} - An array of all of the nests
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Nest>>> {
    // Retrieves nests and sorts them alphabetically
    const creator = await UserCollection.findOneByUsername(username);
    return NestModel.find({creatorId: creator._id}).sort({name: 1}).populate('creatorId');
  }

  /**
   * Get all the nests in the database
   *
   * @return {Promise<HydratedDocument<Nest>[]>} - An array of all of the nests
   */
  static async findAll(): Promise<Array<HydratedDocument<Nest>>> {
    // Retrieves nests and sorts them alphabetically
    return NestModel.find({}).sort({name: 1}).populate('creatorId');
  }

  /**
   * Update a nest with new members or posts
   *
   * @param {string} nestId - The id of the nest to be updated
   * @param {string} memberId - The id of the member to be updated
   * @param {string} freetId - The id of the member to be updated
   * @param {boolean} operation - Whether to add or remove
   * @return {Promise<HydratedDocument<Nest>>} - The newly updated nest
   */
  static async updateOne(nestId: Types.ObjectId | string, memberId: string | undefined, freetId: string | undefined, operation: string): Promise<HydratedDocument<Nest>> {
    const check = 'add';
    const add = check === operation.toLowerCase();
    const nest = await NestModel.findOne({_id: nestId});
    if (add) {
      if (memberId !== undefined) {
        const user = await UserCollection.findOneByUserId(memberId);
        nest.members.push(user._id);
      }

      if (freetId !== undefined) {
        const post = await FreetCollection.findOne(freetId);
        nest.posts.push(post._id);
      }
    } else {
      if (memberId !== undefined) {
        const user = await UserCollection.findOneByUserId(memberId);
        const index = nest.members.indexOf(user._id);
        if (index !== -1) {
          nest.members.splice(index, 1);
        }
      }

      if (freetId !== undefined) {
        const post = await FreetCollection.findOne(freetId);
        const index = nest.posts.indexOf(post._id);
        if (index !== -1) {
          nest.posts.splice(index, 1);
        }
      }
    }

    await nest.save();
    return nest.populate('creatorId');
  }

  /**
   * Delete a nest with given nestId.
   *
   * @param {string} nestId - The nestId of nest to delete
   * @return {Promise<Boolean>} - true if the nest has been deleted, false otherwise
   */
  static async deleteOne(nestId: Types.ObjectId | string): Promise<boolean> {
    const nest = await NestModel.deleteOne({_id: nestId});
    return nest !== null;
  }

  /**
   * Delete all the nests by the given author
   *
   * @param {string} creatorId - The id of creator of nests
   */
  static async deleteMany(creatorId: Types.ObjectId | string): Promise<void> {
    await NestModel.deleteMany({creatorId});
  }
}

export default NestCollection;
