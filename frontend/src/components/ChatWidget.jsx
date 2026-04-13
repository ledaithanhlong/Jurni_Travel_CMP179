import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Socket connects to base server URL (without /api path)
const SOCKET_URL = API_URL.replace(/\/api$/, '');

function ChatWidgetBase({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatType, setChatType] = useState(null); // null, 'ai', 'human'
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const customerName = user?.fullName || 'Khách';
  const customerEmail = user?.primaryEmailAddress?.emailAddress || '';

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = SOCKET_URL + '/chat';
    console.log('Initializing socket connection to:', socketUrl);

    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('✅ Connected to chat server');
    });

    socketRef.current.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Disconnected from chat server. Reason:', reason);
    });

    socketRef.current.on('connect_error', (error) => {
      setIsConnected(false);
      console.error('Socket connection error:', error.message);
      setError('Không thể kết nối đến server chat. Vui lòng kiểm tra kết nối.');
    });

    socketRef.current.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('Failed to reconnect after multiple attempts');
      setError('Không thể kết nối lại. Vui lòng tải lại trang.');
    });

    socketRef.current.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    });

    socketRef.current.on('user-typing', ({ isTyping: typing }) => {
      setIsTyping(typing);
    });

    // Handle conversation closed by admin
    socketRef.current.on('conversation-closed', () => {
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        sender_type: 'agent',
        sender_name: 'Jurni Support',
        message: 'Cuộc hội thoại đã được đóng. Cảm ơn bạn đã liên hệ với Jurni!',
        timestamp: new Date(),
      }]);
    });

    // Handle agent joined
    socketRef.current.on('agent-joined', ({ agentName }) => {
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        sender_type: 'agent',
        sender_name: 'Jurni Support',
        message: `${agentName} đã tham gia và sẵn sàng hỗ trợ bạn!`,
        timestamp: new Date(),
      }]);
    });

    return () => {
      if (socketRef.current) {
        console.log('🔌 Disconnecting socket...');
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start conversation
  const startConversation = async (type) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if socket is connected
      if (!socketRef.current || !isConnected) {
        throw new Error('Chưa kết nối đến server. Vui lòng thử lại.');
      }

      const response = await fetch(`${API_URL}/chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          user_id: user?.id || null,
          conversation_type: type,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo cuộc hội thoại. Vui lòng thử lại.');
      }

      const data = await response.json();
      if (data.success) {
        setConversationId(data.conversation.id);
        setChatType(type);

        // Join conversation room
        socketRef.current.emit('join-conversation', {
          conversationId: data.conversation.id,
        });

        // Add welcome message
        const welcomeMsg = type === 'ai'
          ? 'Xin chào! Tôi là trợ lý AI của Jurni. Tôi có thể giúp gì cho bạn hôm nay?'
          : 'Xin chào! Bạn đang chờ kết nối với nhân viên hỗ trợ. Vui lòng chờ trong giây lát...';

        setMessages([{
          id: 0,
          sender_type: type === 'ai' ? 'ai' : 'agent',
          sender_name: type === 'ai' ? 'Jurni AI' : 'Jurni Support',
          message: welcomeMsg,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error(data.error || 'Không thể tạo cuộc hội thoại');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!inputMessage.trim() || !conversationId) return;

    const messageData = {
      conversationId,
      senderType: 'customer',
      senderName: customerName,
      message: inputMessage.trim(),
    };

    socketRef.current.emit('send-message', messageData);
    setInputMessage('');

    // Stop typing indicator
    socketRef.current.emit('typing', {
      conversationId,
      senderName: customerName,
      isTyping: false,
    });
  };

  // Handle typing
  const handleTyping = (e) => {
    setInputMessage(e.target.value);

    if (!conversationId) return;

    // Send typing indicator
    socketRef.current.emit('typing', {
      conversationId,
      senderName: customerName,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing', {
        conversationId,
        senderName: customerName,
        isTyping: false,
      });
    }, 2000);
  };

  // Reset chat
  const resetChat = () => {
    setChatType(null);
    setConversationId(null);
    setMessages([]);
    setInputMessage('');
    setError(null);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-2xl transition-transform hover:scale-110"
      >
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col rounded-2xl border border-blue-100 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="font-semibold">Hỗ trợ Jurni</span>
        </div>
        <div className="flex items-center gap-2">
          {chatType && (
            <button
              onClick={resetChat}
              className="rounded-full p-1 hover:bg-white/20 transition"
              title="Bắt đầu lại"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 hover:bg-white/20 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Type Selection */}
      {!chatType && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 bg-white">
          <h3 className="text-lg font-semibold text-blue-900">Chọn loại hỗ trợ</h3>
          <p className="text-center text-sm text-blue-700/70">Bạn muốn chat với AI hay nhân viên?</p>

          {error && (
            <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isConnected && (
            <div className="w-full rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700">
              Đang kết nối đến server...
            </div>
          )}

          <button
            onClick={() => startConversation('ai')}
            disabled={isLoading || !isConnected}
            className="w-full rounded-xl border-2 border-blue-500 bg-blue-50 px-6 py-4 text-left transition hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-blue-900">Chat với AI</p>
                <p className="text-xs text-blue-700/70">Trả lời nhanh, 24/7</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => startConversation('human')}
            disabled={isLoading || !isConnected}
            className="w-full rounded-xl border-2 border-orange-500 bg-orange-50 px-6 py-4 text-left transition hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-orange-900">Chat với nhân viên</p>
                <p className="text-xs text-orange-700/70">Hỗ trợ chuyên sâu</p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Messages */}
      {chatType && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender_type === 'customer'
                    ? 'bg-blue-600 text-white'
                    : msg.sender_type === 'ai'
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  {msg.sender_type !== 'customer' && (
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
                onChange={handleTyping}
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
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            {!isConnected && (
              <p className="mt-2 text-xs text-red-500">Đang kết nối lại...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ClerkAwareChatWidget() {
  const { user } = useUser();
  return <ChatWidgetBase user={user} />;
}

export default function ChatWidget({ clerkEnabled = false }) {
  if (clerkEnabled) {
    return <ClerkAwareChatWidget />;
  }

  return <ChatWidgetBase user={null} />;
}
