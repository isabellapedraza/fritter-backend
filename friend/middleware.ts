import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FriendCollection from '../friend/collection';

/**
 * Checks if a user is already friends with recipientId in req.body
 */
const isAlreadyFriends = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.recipient) {
    res.status(400).json({
      error: 'Provided username to add as a friend must be nonempty.'
    });
    return;
  }

  const friends = await FriendCollection.findAllByUsername(req.body.recipient);
  const isFriends = friends[0].friends.includes(req.session.userId);
  if (isFriends) {
    res.status(409).json({
      error: {
        alreadyFriends: `You are already friends with ${req.body.recipient as string}.`
      }
    });
    return;
  }

  next();
};

export {
  isAlreadyFriends
};
