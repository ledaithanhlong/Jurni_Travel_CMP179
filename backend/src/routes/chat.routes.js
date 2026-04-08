import { Router } from 'express';
import db from '../models/index.js';

const router = Router();

router.post('/conversations', async (req, res, next) => {
  try {
    const {
      customer_name,
      customer_email,
      user_id,
      conversation_type
    } = req.body;

    if (!customer_name || !conversation_type) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin tạo hội thoại'
      });
    }

    if (!['ai', 'human'].includes(conversation_type)) {
      return res.status(400).json({
        success: false,
        error: 'conversation_type phải là ai hoặc human'
      });
    }

    const conversation = await db.ChatConversation.create({
      customer_name,
      customer_email: customer_email || null,
      user_id: user_id || null,
      conversation_type,
      status: conversation_type === 'human' ? 'waiting' : 'active',
      last_message_at: new Date()
    });

    return res.status(201).json({
      success: true,
      conversation
    });
  } catch (e) {
    console.error('Error creating conversation:', e);
    return next(e);
  }
});

router.get('/conversations', async (req, res, next) => {
  try {
    const conversations = await db.ChatConversation.findAll({
      order: [['last_message_at', 'DESC']]
    });

    const conversationsWithLatestMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const latestMessage = await db.ChatMessage.findOne({
          where: { conversation_id: conversation.id },
          order: [['timestamp', 'DESC']]
        });

        return {
          ...conversation.toJSON(),
          messages: latestMessage ? [latestMessage] : []
        };
      })
    );

    return res.json({
      success: true,
      conversations: conversationsWithLatestMessage
    });
  } catch (e) {
    console.error('Error listing conversations:', e);
    return next(e);
  }
});

router.get('/conversations/statistics', async (req, res, next) => {
  try {
    const total = await db.ChatConversation.count();
    const active = await db.ChatConversation.count({ where: { status: 'active' } });
    const waiting = await db.ChatConversation.count({ where: { status: 'waiting' } });
    const closed = await db.ChatConversation.count({ where: { status: 'closed' } });

    return res.json({
      success: true,
      statistics: { total, active, waiting, closed }
    });
  } catch (e) {
    console.error('Error getting conversation statistics:', e);
    return next(e);
  }
});

router.get('/conversations/:conversationId/messages', async (req, res, next) => {
  try {
    const conversationId = parseInt(req.params.conversationId, 10);
    if (Number.isNaN(conversationId)) {
      return res.status(400).json({ success: false, error: 'conversationId không hợp lệ' });
    }

    const messages = await db.ChatMessage.findAll({
      where: { conversation_id: conversationId },
      order: [['timestamp', 'ASC']]
    });

    return res.json({ success: true, messages });
  } catch (e) {
    console.error('Error getting messages:', e);
    return next(e);
  }
});

router.put('/conversations/:conversationId/close', async (req, res, next) => {
  try {
    const conversationId = parseInt(req.params.conversationId, 10);
    if (Number.isNaN(conversationId)) {
      return res.status(400).json({ success: false, error: 'conversationId không hợp lệ' });
    }

    const conversation = await db.ChatConversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy hội thoại' });
    }

    await conversation.update({ status: 'closed' });
    return res.json({ success: true });
  } catch (e) {
    console.error('Error closing conversation:', e);
    return next(e);
  }
});

export default router;
