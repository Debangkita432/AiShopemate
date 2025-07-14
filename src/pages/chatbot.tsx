import React from 'react';
import ChatbotOnboarding from '../components/ChatbotOnboarding';
import { MessageCircle } from 'lucide-react';

const ChatbotPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#0071ce] flex items-center justify-center shadow-lg mb-2">
          {/* Replace with your chatbot logo if available */}
          <MessageCircle className="w-12 h-12 text-white" />
        </div>
        <div className="text-xl font-bold text-[#0071ce] tracking-wide font-sans">ShopNest Chatbot</div>
      </div>
      <div className="w-full max-w-md">
        <ChatbotOnboarding />
      </div>
    </div>
  );
};

export default ChatbotPage; 