import { Router } from 'express';
import { ExploreController } from './explore.controller';
import { protect } from '../../../middlewares/protect';
import { optionalProtect } from '../../../middlewares/optionalProtect';

const router = Router();

// Public explore data (can be accessed without login, button 'Feed' is default)
// Added optionalProtect to extract user if logged in for personalized suggestions
router.get('/', optionalProtect, ExploreController.getExploreData);
router.get('/groups', optionalProtect, ExploreController.getGroups);
router.post('/groups', protect, ExploreController.createGroup);

// Protected follow and group actions
router.post('/follow/:followId', protect, ExploreController.toggleFollow);
router.post('/groups/join/:groupId', protect, ExploreController.toggleGroupJoin);

export default router;
