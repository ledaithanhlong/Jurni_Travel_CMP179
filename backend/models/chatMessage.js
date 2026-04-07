import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: randomUUID,
        },
        conversation_id: {
            type: String,
            required: true,
            ref: 'ChatConversation',
        },
        sender_type: {
            type: String,
            enum: ['customer', 'admin', 'ai', 'system'],
            required: true,
        },
        sender_name: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: 'chat_messages',
        timestamps: true,
        versionKey: false,
    }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
