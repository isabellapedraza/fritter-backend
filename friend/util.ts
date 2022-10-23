import type {HydratedDocument} from 'mongoose';
import type {Types, PopulatedDoc, Document} from 'mongoose';
import type {Friend, PopulatedFriend} from './model';

// Update this if you add a property to the Friend type!
type FriendResponse = {
  _id: string;
  user: string;
  friends: Types.ObjectId[];
};

/**
 * Transform a raw Friend object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Friend>} friend - A friend object
 * @returns {FriendResponse} - The friend object formatted for the frontend
 */
const constructFriendResponse = (friend: HydratedDocument<Friend>): FriendResponse => {
  const friendCopy: PopulatedFriend = {
    ...friend.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = friendCopy.user;
  delete friendCopy.user;
  return {
    ...friendCopy,
    _id: friendCopy._id.toString(),
    user: username
  };
};

export {
  constructFriendResponse
};
