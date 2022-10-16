import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import NestCollection from '../nest/collection';
import * as userValidator from '../user/middleware';
import * as nestValidator from '../nest/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get nests by creator.
 *
 * @name GET /api/nests?creatorId=id
 *
 * @return {NestResponse[]} - An array of nests created by user with id, creatorId
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

    const allNests = await NestCollection.findAll();
    const response = allNests.map(util.constructNestResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isCreatorExists
  ],
  async (req: Request, res: Response) => {
    const creatorNests = await NestCollection.findAllByUsername(req.query.creator as string);
    const response = creatorNests.map(util.constructNestResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new nest.
 *
 * @name POST /api/nests
 *
 * @param {string} name - The name of the nest
 * @return {FreetResponse} - The created nest
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the nest name is empty or a stream of empty spaces
 * @throws {413} - If the nest name is more than 30 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    nestValidator.isValidNestName
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const nest = await NestCollection.addOne(userId, req.body.name, [], []);
    res.status(201).json({
      message: 'Your nest was created successfully.',
      nest: util.constructNestResponse(nest)
    });
  }
);

// /**
//  * Delete a freet
//  *
//  * @name DELETE /api/freets/:id
//  *
//  * @return {string} - A success message
//  * @throws {403} - If the user is not logged in or is not the author of
//  *                 the freet
//  * @throws {404} - If the freetId is not valid
//  */
// router.delete(
//   '/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier
//   ],
//   async (req: Request, res: Response) => {
//     const nests = await NestCollection.findAll();
//     const freet = await FreetCollection.findOne(req.params.freetId);
//     for (const nest of nests) { // Deletes post from all nests
//       const index = nest.posts.indexOf(freet._id);
//       if (index !== -1) {
//         nest.posts.splice(index, 1);
//       }
//     }

//     await FreetCollection.deleteOne(req.params.freetId);
//     res.status(200).json({
//       message: 'Your freet was deleted successfully.'
//     });
//   }
// );

// /**
//  * Modify a freet
//  *
//  * @name PUT /api/freets/:id
//  *
//  * @param {string} content - the new content for the freet
//  * @return {FreetResponse} - the updated freet
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the freet
//  * @throws {404} - If the freetId is not valid
//  * @throws {400} - If the freet content is empty or a stream of empty spaces
//  * @throws {413} - If the freet content is more than 140 characters long
//  */
// router.put(
//   '/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier,
//     freetValidator.isValidFreetContent
//   ],
//   async (req: Request, res: Response) => {
//     const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
//     res.status(200).json({
//       message: 'Your freet was updated successfully.',
//       freet: util.constructFreetResponse(freet)
//     });
//   }
// );

export {router as nestRouter};
