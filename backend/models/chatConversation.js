import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const chatConversationSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: randomUUID,
        },
        user_id: {
            type: String,
            ref: 'User',
            default: null,
        },
        conversation_type: {
            type: String,
            enum: ['ai', 'support'],
            default: 'ai',
        },
        status: {
            type: String,
            enum: ['active', 'closed'],
            default: 'active',
        },
        last_message_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: 'chat_conversations',
        timestamps: true,
        versionKey: false,
    }
);

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);

export default ChatConversation;
