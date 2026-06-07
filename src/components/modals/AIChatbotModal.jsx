import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import { cn } from '../../utils/cn';

export const AIChatbotModal = ({ onClose, userData }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! 둥지탈출 AI 멘토입니다. 주거 정책 서류 준비나 신청 절차 중 궁금한 점이 있으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://nest-escape-api.user.workers.dev';
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.slice(1), // Exclude initial greeting from history sent to API
          userData: userData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          type: 'bot', 
          text: data.reply 
        }]);
      } else {
        throw new Error(data.message || 'Chat failed');
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: '죄송합니다. 서비스 연결에 문제가 발생했습니다. 나중에 다시 시도해 주세요.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-x-4 bottom-4 md:right-4 md:left-auto md:w-96 h-[500px] z-[80] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary p-4 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Bot size={18} /></div>
          <div>
            <h3 className="font-black text-sm">AI 멘토 실시간 상담</h3>
            <p className="text-[10px] text-primary-100 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={18}/></button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex", msg.type === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] rounded-2xl p-3 text-xs font-medium leading-relaxed shadow-sm", msg.type === 'user' ? "bg-gray-900 text-white rounded-br-sm" : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm")}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-3 shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-1 pr-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 점을 물어보세요..." 
            className="flex-1 bg-transparent px-3 py-2 text-xs outline-none"
            disabled={isTyping}
          />
          <button type="submit" disabled={!input.trim() || isTyping} className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
            <Send size={14} className="-ml-0.5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};
