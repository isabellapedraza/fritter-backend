import type {HydratedDocument, PopulatedDoc, Types} from 'mongoose';
import type {Time} from './model';
import TimeModel from './model';
import UserCollection from '../user/collection';
import NestCollection from '../nest/collection';

/**
 * This files contains a class that has the functionality to explore times
 * stored in MongoDB, including adding, finding, updating, and deleting times.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Time> is the output of the TimeModel() constructor,
 * and contains all the information in Time. https://mongoosejs.com/docs/typescript.html
 */
class TimeCollection {
  /**
   * Add a time to the collection
   *
   * @param {string} creatorId - The creator of the time
   * @param {string} groupId - The id of the group
   * @param {string} startTime - The start time
   * @param {string} endTime - The end time
   * @return {Promise<HydratedDocument<Time>>} - The newly created time
   */
  static async addOne(creatorId: Types.ObjectId | string, groupId: Types.ObjectId | string, startTime: string, endTime: string): Promise<HydratedDocument<Time>> {
    const time = new TimeModel({
      creatorId,
      groupId,
      startTime,
      endTime
    });
    await time.save(); // Saves time to MongoDB
    return time.populate(['creatorId', 'groupId']);
  }

  /**
   * Find a time by timeId
   *
   * @param {string} timeId - The id of the time to find
   * @return {Promise<HydratedDocument<Time>> | Promise<null> } - The time with the given timeId, if any
   */
  static async findOne(timeId: Types.ObjectId | string): Promise<HydratedDocument<Time>> {
    return TimeModel.findOne({_id: timeId}).populate(['creatorId', 'groupId']);
  }

  /**
   * Get all the times in by given creator
   *
   * @param {string} username - The username of creator of the times
   * @return {Promise<HydratedDocument<Time>[]>} - An array of all of the times
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Time>>> {
    // Retrieves times
    const creator = await UserCollection.findOneByUsername(username);
    return TimeModel.find({creatorId: creator._id}).populate(['creatorId', 'groupId']);
  }

  /**
   * Get all the times in by given groupId
   *
   * @param {string} groupId - The groupId of group in time
   * @return {Promise<HydratedDocument<Time>[]>} - An array of all of the times
   */
  static async findAllByGroup(groupId: string): Promise<Array<HydratedDocument<Time>>> {
    // Retrieves times
    const group = await NestCollection.findOne(groupId);
    return TimeModel.find({groupId: group._id}).populate(['creatorId', 'groupId']);
  }

  /**
   * Get all the times in the database
   *
   * @return {Promise<HydratedDocument<Time>[]>} - An array of all of the times
   */
  static async findAll(): Promise<Array<HydratedDocument<Time>>> {
    // Retrieves times
    return TimeModel.find({}).populate(['creatorId', 'groupId']);
  }

  /**
   * Update a time
   *
   * @param {string} timeId - The id of the time to be updated
   * @param {string} startTime - The start time of the time to be updated
   * @param {string} endTime - The end time of the time to be updated
   * @return {Promise<HydratedDocument<Time>>} - The newly updated time
   */
  static async updateOne(timeId: Types.ObjectId | string, startTime: string | undefined, endTime: string | undefined): Promise<HydratedDocument<Time>> {
    const time = await TimeModel.findOne({_id: timeId});

    if (startTime !== undefined) {
      time.startTime = startTime;
    }

    if (endTime !== undefined) {
      time.endTime = endTime;
    }

    await time.save();
    return time.populate(['creatorId', 'groupId']);
  }

  /**
   * Delete a time with given timeId.
   *
   * @param {string} timeId - The timeId of time to delete
   * @return {Promise<Boolean>} - true if the time has been deleted, false otherwise
   */
  static async deleteOne(timeId: Types.ObjectId | string): Promise<boolean> {
    const time = await TimeModel.deleteOne({_id: timeId});
    return time !== null;
  }

  /**
   * Delete all the times by the given creator
   *
   * @param {string} creatorId - The id of creator of times
   */
  static async deleteMany(creatorId: Types.ObjectId | string): Promise<void> {
    await TimeModel.deleteMany({creatorId});
  }
}

export default TimeCollection;

