import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FriendCollection from '../friend/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get a user's friends.
 *
 * @name GET /api/friends?userId=id
 *
 * @return {FriendResponse} - The friends of a user
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user query parameter was supplied
    if (req.query.user !== undefined) {
      next();
      return;
    }

    const allFriends = await FriendCollection.findAll();
    const response = allFriends.map(util.constructFriendResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const userFriends = await FriendCollection.findAllByUsername(req.query.user as string);
    const response = userFriends.map(util.constructFriendResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new friend
 *
 * @name POST /api/friends
 *
 * @param {string} user - The root user
 * @param {string} recipient - the user you want to add as a friend
 * @return {FriendResponse} - The created friend
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const friend = await FriendCollection.updateOne(userId, req.body.recipient, 'add');
    res.status(201).json({
      message: 'Your are now friends!',
      friend: util.constructFriendResponse(friend)
    });
  }
);

/**
 * Remove a new friend
 *
 * @name Delete /api/friends
 *
 * @param {string} user - The root user
 * @param {string} recipient - the user you want to remove as a friend
 * @return {FriendResponse} - The updated friend
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const friend = await FriendCollection.updateOne(userId, req.body.recipient, 'remove');
    res.status(201).json({
      message: 'Your are no longer friends!',
      friend: util.constructFriendResponse(friend)
    });
  }
);

export {router as friendRouter};
