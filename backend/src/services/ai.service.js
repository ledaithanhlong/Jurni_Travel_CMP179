import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `You are a helpful customer support AI assistant for Jurni, a travel booking platform.

Jurni offers the following services:
- Hotel bookings (domestic and international)
- Flight tickets (domestic and international)
- Activity and tour bookings
- Car rentals
- Travel packages

Your role:
- Answer questions about Jurni's services
- Help customers understand how to book
- Provide information about pricing, policies, and features
- If a customer needs complex assistance or wants to speak with a human, politely suggest they switch to a human agent
- Be friendly, professional, and concise
- Always stay on topic about travel and Jurni services

If asked about things outside of travel/Jurni, politely redirect the conversation back to how you can help with their travel needs.`;

export async function generateAIResponse(userMessage, conversationHistory = []) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return 'Xin lỗi, dịch vụ AI chat tạm thời không khả dụng. Vui lòng chọn chat với nhân viên để được hỗ trợ.';
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Build conversation context
        const context = conversationHistory
            .slice(-10) // Last 10 messages for context
            .map(msg => `${msg.sender_type === 'customer' ? 'Customer' : 'AI'}: ${msg.message}`)
            .join('\n');

        const prompt = `${systemPrompt}\n\nConversation history:\n${context}\n\nCustomer: ${userMessage}\n\nAI:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error('AI Service Error:', error);
        return 'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại hoặc chọn chat với nhân viên để được hỗ trợ tốt hơn.';
    }
}
