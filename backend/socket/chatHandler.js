import db from '../models/index.js';
import { generateAIResponse } from '../services/ai.service.js';

export function setupChatSocket(io) {
    const chatNamespace = io.of('/chat');

    chatNamespace.on('connection', (socket) => {
        console.log('Client connected to chat:', socket.id);

        // Join a conversation room
        socket.on('join-conversation', async ({ conversationId }) => {
            socket.join(`conversation-${conversationId}`);
            console.log(`Socket ${socket.id} joined conversation ${conversationId}`);

            // Notify others in the room
            socket.to(`conversation-${conversationId}`).emit('user-joined', {
                socketId: socket.id,
                conversationId,
            });
        });

        // Send message
        socket.on('send-message', async (data) => {
            try {
                const { conversationId, senderType, senderName, message } = data;

                // Save message to database
                const newMessage = await db.ChatMessage.create({
                    conversation_id: conversationId,
                    sender_type: senderType,
                    sender_name: senderName,
                    message,
                    timestamp: new Date(),
                });

                // Update conversation last_message_at
                await db.ChatConversation.findByIdAndUpdate(conversationId, {
                    last_message_at: new Date()
                });

                // Broadcast message to all in the conversation
                chatNamespace.to(`conversation-${conversationId}`).emit('new-message', {
                    id: newMessage._id,
                    conversation_id: conversationId,
                    sender_type: senderType,
                    sender_name: senderName,
                    message,
                    timestamp: newMessage.timestamp,
                });

                // If customer sent message to AI, generate AI response
                if (senderType === 'customer') {
                    const conversation = await db.ChatConversation.findById(conversationId);

                    if (conversation && conversation.conversation_type === 'ai') {
                        // Get conversation history for context
                        const history = await db.ChatMessage.find({ conversation_id: conversationId })
                            .sort({ timestamp: -1 })
                            .limit(10);

                        // Generate AI response
                        const aiResponse = await generateAIResponse(message, history.reverse());

                        // Save AI response
                        const aiMessage = await db.ChatMessage.create({
                            conversation_id: conversationId,
                            sender_type: 'ai',
                            sender_name: 'Jurni AI Assistant',
                            message: aiResponse,
                            timestamp: new Date(),
                        });

                        // Broadcast AI response
                        setTimeout(() => {
                            chatNamespace.to(`conversation-${conversationId}`).emit('new-message', {
                                id: aiMessage._id,
                                conversation_id: conversationId,
                                sender_type: 'ai',
                                sender_name: 'Jurni AI Assistant',
                                message: aiResponse,
                                timestamp: aiMessage.timestamp,
                            });
                        }, 1000); // Small delay to simulate typing
                    }
                }
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message-error', { error: 'Failed to send message' });
            }
        });

        // Typing indicator
        socket.on('typing', ({ conversationId, senderName, isTyping }) => {
            socket.to(`conversation-${conversationId}`).emit('user-typing', {
                conversationId,
                senderName,
                isTyping,
            });
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from chat:', socket.id);
        });
    });
}
