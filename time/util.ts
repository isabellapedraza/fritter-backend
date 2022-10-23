import type {HydratedDocument} from 'mongoose';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import type {Time, PopulatedTime} from '../time/model';

// Update this if you add a property to the Time type!
type TimeResponse = {
  _id: string; // MongoDB assigns each object this ID on creation
  creatorId: string;
  groupId: string;
  startTime: string;
  endTime: string;
};

/**
 * Transform a raw Time object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Time>} time - A Time
 * @returns {TimeResponse} - The time object formatted for the frontend
 */
const constructTimeResponse = (time: HydratedDocument<Time>): TimeResponse => {
  const timeCopy: PopulatedTime = {
    ...time.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = timeCopy.creatorId;
  let name = '';

  if (timeCopy.groupId !== null) {
    name = timeCopy.groupId.name;
  }

  delete timeCopy.creatorId;
  delete timeCopy.groupId;
  return {
    ...timeCopy,
    _id: timeCopy._id.toString(),
    creatorId: username,
    groupId: name
  };
};

export {
  constructTimeResponse
};
