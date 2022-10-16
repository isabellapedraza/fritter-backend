import type {HydratedDocument} from 'mongoose';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import type {Nest, PopulatedNest} from '../nest/model';

// Update this if you add a property to the Nest type!
type NestResponse = {
  _id: string;
  name: string;
  creatorId: string;
  members: Types.ObjectId[];
  posts: Types.ObjectId[];
};

/**
 * Transform a raw Nest object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Nest>} nest - A Nest
 * @returns {NestResponse} - The nest object formatted for the frontend
 */
const constructNestResponse = (nest: HydratedDocument<Nest>): NestResponse => {
  const nestCopy: PopulatedNest = {
    ...nest.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = nestCopy.creatorId;
  delete nestCopy.creatorId;
  return {
    ...nestCopy,
    _id: nestCopy._id.toString(),
    name: nestCopy.name,
    creatorId: username
  };
};

export {
  constructNestResponse
};
