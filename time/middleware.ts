import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TimeCollection from '../time/collection';

/**
 * Checks if a time with timeId is req.params exists
 */
const isTimeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.timeId);
  const time = validFormat ? await TimeCollection.findOne(req.params.timeId) : '';
  if (!time) {
    res.status(404).json({
      error: {
        timeNotFound: `Time with time ID ${req.params.timeId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the creator of the time whose timeId is in req.params
 */
const isValidTimeModifier = async (req: Request, res: Response, next: NextFunction) => {
  const time = await TimeCollection.findOne(req.params.timeId);
  const userId = time.creatorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' times.'
    });
    return;
  }

  next();
};

export {
  isTimeExists,
  isValidTimeModifier
};
