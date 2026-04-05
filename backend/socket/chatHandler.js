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
                await db.ChatConversation.update(
                    { last_message_at: new Date() },
                    { where: { id: conversationId } }
                );

                // Broadcast message to all in the conversation
                chatNamespace.to(`conversation-${conversationId}`).emit('new-message', {
                    id: newMessage.id,
                    conversation_id: conversationId,
                    sender_type: senderType,
                    sender_name: senderName,
                    message,
                    timestamp: newMessage.timestamp,
                });

                // If customer sent message to AI, generate AI response
                if (senderType === 'customer') {
                    const conversation = await db.ChatConversation.findByPk(conversationId);

                    if (conversation && conversation.conversation_type === 'ai') {
                        // Get conversation history for context
                        const history = await db.ChatMessage.findAll({
                            where: { conversation_id: conversationId },
                            order: [['timestamp', 'DESC']],
                            limit: 10,
                        });

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
                                id: aiMessage.id,
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

        // Agent joins conversation (for admin)
        socket.on('agent-join', async ({ conversationId, agentId, agentName }) => {
            try {
                await db.ChatConversation.update(
                    {
                        assigned_agent_id: agentId,
                        status: 'active',
                    },
                    { where: { id: conversationId } }
                );

                chatNamespace.to(`conversation-${conversationId}`).emit('agent-joined', {
                    conversationId,
                    agentName,
                });
            } catch (error) {
                console.error('Error assigning agent:', error);
            }
        });

        // Close conversation
        socket.on('close-conversation', async ({ conversationId }) => {
            try {
                await db.ChatConversation.update(
                    { status: 'closed' },
                    { where: { id: conversationId } }
                );

                chatNamespace.to(`conversation-${conversationId}`).emit('conversation-closed', {
                    conversationId,
                });
            } catch (error) {
                console.error('Error closing conversation:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from chat:', socket.id);
        });
    });

    return chatNamespace;
}
