import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TimeCollection from '../time/collection';
import * as userValidator from '../user/middleware';
import * as nestValidator from '../nest/middleware';
import * as timeValidator from '../time/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get times by creator.
 *
 * @name GET /api/times?creatorId=id
 *
 * @return {TimeResponse[]} - An array of times created by user with id, creatorId
 * @throws {400} - If creatorId is not given
 * @throws {404} - If no user has given creatorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if creator query parameter was supplied
    if (req.query.creator !== undefined) {
      next();
      return;
    }

    const allTimes = await TimeCollection.findAll();
    const response = allTimes.map(util.constructTimeResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isCreatorExists
  ],
  async (req: Request, res: Response) => {
    const creatorTimes = await TimeCollection.findAllByUsername(req.query.creator as string);
    const response = creatorTimes.map(util.constructTimeResponse);
    res.status(200).json(response);
  }
);

/**
 * Get times by group.
 *
 * @name GET /api/times?groupId=id
 *
 * @return {TimeResponse[]} - An array of times with group, groupId
 * @throws {400} - If groupId is not given
 * @throws {404} - If no user has given groupId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if group query parameter was supplied
    if (req.query.group !== undefined) {
      next();
      return;
    }

    const allTimes = await TimeCollection.findAll();
    const response = allTimes.map(util.constructTimeResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const groupTimes = await TimeCollection.findAllByGroup(req.query.group as string);
    const response = groupTimes.map(util.constructTimeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new time.
 *
 * @name POST /api/times
 *
 * @param {string} groupId - The id of the group
 * @param {string} startTime - The start time
 * @param {string} endTime - The end time
 * @return {TimeResponse} - The created time
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const time = await TimeCollection.addOne(userId, req.body.groupId, req.body.startTime, req.body.endTime);
    res.status(201).json({
      message: 'Your time was created successfully.',
      time: util.constructTimeResponse(time)
    });
  }
);

/**
 * Delete a time
 *
 * @name DELETE /api/times/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the time
 * @throws {404} - If the timeId is not valid
 */
router.delete(
  '/:timeId?',
  [
    userValidator.isUserLoggedIn,
    timeValidator.isTimeExists,
    timeValidator.isValidTimeModifier
  ],
  async (req: Request, res: Response) => {
    await TimeCollection.deleteOne(req.params.timeId);
    res.status(200).json({
      message: 'Your time was deleted successfully.'
    });
  }
);

/**
 * Modify a time's startTime
 *
 * @name PUT /api/times/:id/startTime
 *
 * @param {string} timeId - the timeId you want to edit
 * @return {TimeResponse} - the updated time
 * @throws {403} - if the user is not logged in or not the creator of
 *                 of the time
 * @throws {404} - If the time is not valid
 */
router.put(
  '/:timeId?/startTime',
  [
    userValidator.isUserLoggedIn,
    timeValidator.isTimeExists,
    timeValidator.isValidTimeModifier
  ],
  async (req: Request, res: Response) => {
    const time = await TimeCollection.updateOne(req.params.timeId, req.body.startTime, undefined);
    res.status(200).json({
      message: 'Your time was updated successfully.',
      time: util.constructTimeResponse(time)
    });
  }
);

/**
 * Modify a times's endTime
 *
 * @name PUT /api/times/:id/endTime
 *
 * @param {string} timeId - the timeId you want to edit
 * @return {TimeResponse} - the updated time
 * @throws {403} - if the user is not logged in or not the creator of
 *                 of the time
 * @throws {404} - If the time is not valid
 */
router.put(
  '/:timeId?/endTime',
  [
    userValidator.isUserLoggedIn,
    timeValidator.isTimeExists,
    timeValidator.isValidTimeModifier
  ],
  async (req: Request, res: Response) => {
    const time = await TimeCollection.updateOne(req.params.timeId, undefined, req.body.endTime);
    res.status(200).json({
      message: 'Your time was updated successfully.',
      time: util.constructTimeResponse(time)
    });
  }
);

export {router as timeRouter};
