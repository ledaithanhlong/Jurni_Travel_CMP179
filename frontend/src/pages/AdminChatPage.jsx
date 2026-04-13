import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
// Socket connects to base server URL (without /api path)
const SOCKET_URL = API_URL.replace(/\/api\/v1$/, '').replace(/\/api$/, '');

export default function AdminChatPage() {
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [statistics, setStatistics] = useState({ total: 0, active: 0, waiting: 0, closed: 0 });
    const [isTyping, setIsTyping] = useState(false);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    // Use ref to avoid stale closure in socket handlers
    const activeConversationIdRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Keep ref in sync with state
    useEffect(() => {
        activeConversationIdRef.current = activeConversationId;
    }, [activeConversationId]);

    // Fetch conversations (defined early so socket handler can call it)
    const fetchConversations = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/chat/conversations`);
            const data = await response.json();
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    }, []);

    // Initialize socket connection ONCE (no activeConversationId dependency!)
    useEffect(() => {
        socketRef.current = io(`${SOCKET_URL}/chat`, {
            transports: ['websocket', 'polling'],
        });

        socketRef.current.on('connect', () => {
            console.log('Admin connected to chat server');
        });

        socketRef.current.on('new-message', (message) => {
            // Use ref to avoid stale closure
            if (message.conversation_id === activeConversationIdRef.current) {
                setMessages(prev => [...prev, message]);
            }
            // Refresh conversations to update last message
            fetchConversations();
        });

        socketRef.current.on('user-typing', ({ isTyping: typing }) => {
            // Only show typing for the active conversation
            setIsTyping(typing);
            // Auto-reset typing after 3 seconds to avoid stuck state
            if (typing) {
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
            } else {
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            }
        });

        // Handle conversation closed by customer
        socketRef.current.on('conversation-closed', ({ conversationId }) => {
            if (conversationId === activeConversationIdRef.current) {
                setActiveConversationId(null);
                setMessages([]);
            }
            fetchConversations();
        });

        // Handle agent joined notification
        socketRef.current.on('agent-joined', ({ agentName }) => {
            setMessages(prev => [...prev, {
                id: `system-${Date.now()}`,
                sender_type: 'agent',
                sender_name: 'System',
                message: `${agentName} đã tham gia cuộc hội thoại.`,
                timestamp: new Date(),
            }]);
        });

        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [fetchConversations]);

    // Fetch statistics
    const fetchStatistics = async () => {
        try {
            const response = await fetch(`${API_URL}/chat/conversations/statistics`);
            const data = await response.json();
            if (data.success) {
                setStatistics(data.statistics);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Fetch messages for a conversation
    const fetchMessages = async (conversationId) => {
        try {
            const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`);
            const data = await response.json();
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // Initial load
    useEffect(() => {
        fetchConversations();
        fetchStatistics();

        // Refresh every 10 seconds
        const interval = setInterval(() => {
            fetchConversations();
            fetchStatistics();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Select conversation
    const selectConversation = async (conversation) => {
        setActiveConversationId(conversation.id);
        await fetchMessages(conversation.id);

        // Join conversation room
        socketRef.current.emit('join-conversation', {
            conversationId: conversation.id,
        });

        // Assign agent if not assigned
        if (!conversation.assigned_agent_id) {
            socketRef.current.emit('agent-join', {
                conversationId: conversation.id,
                agentId: 'admin-1', // In real app, use actual admin ID
                agentName: 'Admin Support',
            });
        }
    };

    // Send message
    const sendMessage = () => {
        if (!inputMessage.trim() || !activeConversationId) return;

        const messageData = {
            conversationId: activeConversationId,
            senderType: 'agent',
            senderName: 'Admin Support',
            message: inputMessage.trim(),
        };

        socketRef.current.emit('send-message', messageData);
        setInputMessage('');
    };

    // Close conversation
    const closeConversation = async (conversationId) => {
        try {
            await fetch(`${API_URL}/chat/conversations/${conversationId}/close`, {
                method: 'PUT',
            });

            socketRef.current.emit('close-conversation', { conversationId });

            if (activeConversationId === conversationId) {
                setActiveConversationId(null);
                setMessages([]);
            }

            fetchConversations();
            fetchStatistics();
        } catch (error) {
            console.error('Error closing conversation:', error);
        }
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-white py-8">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-blue-900">Quản lý Chat Hỗ trợ</h1>
                    <p className="text-sm text-blue-700/70">Quản lý và trả lời tin nhắn từ khách hàng</p>
                </div>

                {/* Statistics */}
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-blue-100 bg-white p-4">
                        <p className="text-sm text-blue-700/70">Tổng số chat</p>
                        <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
                    </div>
                    <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                        <p className="text-sm text-green-700/70">Đang hoạt động</p>
                        <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
                    </div>
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                        <p className="text-sm text-orange-700/70">Đang chờ</p>
                        <p className="text-2xl font-bold text-orange-900">{statistics.waiting}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm text-gray-700/70">Đã đóng</p>
                        <p className="text-2xl font-bold text-gray-900">{statistics.closed}</p>
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
                    {/* Conversation List */}
                    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-lg">
                        <h2 className="mb-4 font-semibold text-blue-900">Danh sách hội thoại</h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto">
                            {conversations.length === 0 ? (
                                <p className="text-center text-sm text-blue-700/70 py-8">Chưa có hội thoại nào</p>
                            ) : (
                                conversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        onClick={() => selectConversation(conv)}
                                        className={`w-full rounded-xl border p-3 text-left transition ${activeConversationId === conv.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-blue-100 hover:bg-blue-50/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-blue-900 truncate">
                                                    {conv.customer_name}
                                                </p>
                                                <p className="text-xs text-blue-700/70 truncate">
                                                    {conv.customer_email || 'Không có email'}
                                                </p>
                                                {conv.messages?.[0] && (
                                                    <p className="text-xs text-blue-600/60 mt-1 truncate">
                                                        {conv.messages[0].message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${conv.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : conv.status === 'waiting'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {conv.status === 'active' ? 'Hoạt động' : conv.status === 'waiting' ? 'Chờ' : 'Đóng'}
                                                </span>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${conv.conversation_type === 'ai'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    {conv.conversation_type === 'ai' ? 'AI' : 'Human'}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Active Chat */}
                    <div className="rounded-2xl border border-blue-100 bg-white shadow-lg flex flex-col h-[650px]">
                        {activeConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="border-b border-blue-100 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-blue-900">{activeConversation.customer_name}</h3>
                                            <p className="text-xs text-blue-700/70">{activeConversation.customer_email}</p>
                                        </div>
                                        <button
                                            onClick={() => closeConversation(activeConversation.id)}
                                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                                        >
                                            Đóng chat
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender_type === 'agent'
                                                    ? 'bg-blue-600 text-white'
                                                    : msg.sender_type === 'ai'
                                                        ? 'bg-purple-100 text-purple-900'
                                                        : 'bg-gray-100 text-gray-900'
                                                    }`}
                                            >
                                                {msg.sender_type !== 'agent' && (
                                                    <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender_name}</p>
                                                )}
                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                <p className="text-xs mt-1 opacity-60">
                                                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                                <div className="flex gap-1">
                                                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                                                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="border-t border-blue-100 p-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage();
                                                }
                                            }}
                                            placeholder="Nhập tin nhắn..."
                                            className="flex-1 rounded-lg border border-blue-100 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!inputMessage.trim()}
                                            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-1 items-center justify-center">
                                <div className="text-center">
                                    <svg className="mx-auto h-16 w-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <p className="mt-4 text-sm text-blue-700/70">Chọn một hội thoại để bắt đầu</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
