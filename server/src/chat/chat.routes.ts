import express from 'express';
import { protect } from '../../middlewares/protect';
import * as chatController from './chat.controller';

const router = express.Router();

router.get('/conversations', protect, chatController.getConversations);
router.get('/messages/:otherUserId', protect, chatController.getMessages);
router.get('/contacts', protect, chatController.getAvailableContacts);
router.put('/message/:messageId', protect, chatController.editMessage);
router.delete('/message/:messageId', protect, chatController.deleteMessage);
router.delete('/clear/:otherUserId', protect, chatController.clearConversation);

export default router;
