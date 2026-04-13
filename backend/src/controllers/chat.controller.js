import db from '../models/index.js';

// Get all conversations (for admin)
export async function getConversations(req, res) {
    try {
        const { status } = req.query;

        const where = status ? { status } : {};

        const conversations = await db.ChatConversation.findAll({
            where,
            include: [{
                model: db.ChatMessage,
                as: 'messages',
                limit: 1,
                order: [['timestamp', 'DESC']],
            }],
            order: [['last_message_at', 'DESC']],
        });

        res.json({ success: true, conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
    }
}

// Get messages for a conversation
export async function getConversationMessages(req, res) {
    try {
        const { id } = req.params;

        const messages = await db.ChatMessage.findAll({
            where: { conversation_id: id },
            order: [['timestamp', 'ASC']],
        });

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
}

// Create new conversation
export async function createConversation(req, res) {
    try {
        const { customer_name, customer_email, user_id, conversation_type } = req.body;

        const conversationType = conversation_type || 'human';

        // AI conversations start as 'active', human conversations start as 'waiting'
        const initialStatus = conversationType === 'ai' ? 'active' : 'waiting';

        const conversation = await db.ChatConversation.create({
            customer_name,
            customer_email,
            user_id,
            conversation_type: conversationType,
            status: initialStatus,
            last_message_at: new Date(),
        });

        res.json({ success: true, conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ success: false, error: 'Failed to create conversation' });
    }
}

// Close conversation
export async function closeConversation(req, res) {
    try {
        const { id } = req.params;

        await db.ChatConversation.update(
            { status: 'closed' },
            { where: { id } }
        );

        res.json({ success: true, message: 'Conversation closed' });
    } catch (error) {
        console.error('Error closing conversation:', error);
        res.status(500).json({ success: false, error: 'Failed to close conversation' });
    }
}

// Assign conversation to agent
export async function assignAgent(req, res) {
    try {
        const { id } = req.params;
        const { agent_id } = req.body;

        await db.ChatConversation.update(
            {
                assigned_agent_id: agent_id,
                status: 'active',
            },
            { where: { id } }
        );

        res.json({ success: true, message: 'Agent assigned' });
    } catch (error) {
        console.error('Error assigning agent:', error);
        res.status(500).json({ success: false, error: 'Failed to assign agent' });
    }
}

// Get conversation statistics
export async function getStatistics(req, res) {
    try {
        const totalConversations = await db.ChatConversation.count();
        const activeConversations = await db.ChatConversation.count({ where: { status: 'active' } });
        const waitingConversations = await db.ChatConversation.count({ where: { status: 'waiting' } });
        const closedConversations = await db.ChatConversation.count({ where: { status: 'closed' } });

        res.json({
            success: true,
            statistics: {
                total: totalConversations,
                active: activeConversations,
                waiting: waitingConversations,
                closed: closedConversations,
            },
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
}
