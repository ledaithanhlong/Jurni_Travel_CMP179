import express from 'express';
import * as chatController from '../controllers/chat.controller.js';

const router = express.Router();

// Get all conversations
router.get('/conversations', chatController.getConversations);

// Get conversation statistics
router.get('/conversations/statistics', chatController.getStatistics);

// Get messages for a conversation
router.get('/conversations/:id/messages', chatController.getConversationMessages);

// Create new conversation
router.post('/conversations', chatController.createConversation);

// Close conversation
router.put('/conversations/:id/close', chatController.closeConversation);

// Assign agent to conversation
router.put('/conversations/:id/assign', chatController.assignAgent);

export default router;
