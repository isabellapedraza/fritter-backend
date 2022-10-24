import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import NestCollection from '../nest/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a nest with nestId is req.params exists
 */
const isNestExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.nestId);
  const nest = validFormat ? await NestCollection.findOne(req.params.nestId) : '';
  if (!nest) {
    res.status(404).json({
      error: {
        nestNotFound: `Nest with nest ID ${req.params.nestId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the name of the nest in req.body is valid, i.e not a stream of empty
 * spaces and not more than 30 characters
 */
const isValidNestName = (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};
  if (!name.trim()) {
    res.status(400).json({
      error: 'Nest name must be at least one character long.'
    });
    return;
  }

  if (name.length > 30) {
    res.status(413).json({
      error: 'Nest name must be no more than 30 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the creator of the nest whose nestId is in req.params
 */
const isValidNestModifier = async (req: Request, res: Response, next: NextFunction) => {
  const nest = await NestCollection.findOne(req.params.nestId);
  const userId = nest.creatorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' nests.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the creator of the nest
 */
const isValidNestMemberViewer = async (req: Request, res: Response, next: NextFunction) => {
  const nest = await NestCollection.findOne(req.params.nestId);
  const userId = nest.creatorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot view other users\' nest\' members.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is a member or creator of the nest
 */
const isValidNestPostViewer = async (req: Request, res: Response, next: NextFunction) => {
  const nest = await NestCollection.findOne(req.params.nestId);
  const userId = nest.creatorId._id;
  if (req.session.userId !== userId.toString() && !nest.members.includes(req.session.userId)) {
    res.status(403).json({
      error: 'Cannot view other users\' nests\' posts if you aren\'t a member or the creator.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is asking to see their own nests
 */
const isValidNestViewer = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUsername(req.query.creator as string);
  if (req.session.userId !== user._id.toString()) {
    res.status(403).json({
      error: 'Cannot view other users\' nests\' if you aren\'t the creator.'
    });
    return;
  }

  next();
};

export {
  isValidNestName,
  isNestExists,
  isValidNestModifier,
  isValidNestMemberViewer,
  isValidNestPostViewer,
  isValidNestViewer
};
