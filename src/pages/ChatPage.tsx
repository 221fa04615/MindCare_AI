import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyzeSentiment, getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, AlertCircle, Phone, Zap, Search, Filter, Calendar, XCircle, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatPage: React.FC = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyMessages, setHistoryMessages] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [senderFilter, setSenderFilter] = useState<'all' | 'user' | 'bot'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [isProactive, setIsProactive] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline'>('connected');
  const scrollRef = useRef<HTMLDivElement>(null);

  const botName = user?.gender === 'Female' ? 'Arjun' : 'Siya';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (data.db !== 'connected') setDbStatus('offline');
      } catch (err) {
        setDbStatus('offline');
      }
    };
    checkStatus();

    // Fresh start for current session
    setMessages([]); 
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setHistoryMessages(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    if (showHistory && token) {
      fetchHistory();
    }
  }, [showHistory, token]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, showHistory, historyMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');

    // Sentiment Analysis
    const sentiment = await analyzeSentiment(userMsg);
    const isCrisis = sentiment === 'Crisis' || /suicide|die|kill myself/i.test(userMsg);

    if (isCrisis) {
      setShowCrisisAlert(true);
      await fetch('/api/crisis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg }),
      });
    }

    // Save User Message
    const userChatRes = await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: userMsg, sender: 'user', sentiment }),
    });
    const userChat = await userChatRes.json();
    setMessages(prev => [...prev, userChat]);

    // Bot Response
    setIsTyping(true);
    
    // Fetch history from DB to provide context to AI
    let contextHistory = [];
    try {
      const historyRes = await fetch('/api/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const historyData = await historyRes.json();
      
      if (historyData.length > 1) {
        // The last message in historyData is the one we just sent (userMsg)
        // We check the gap between this message and the previous one
        const currentMsg = historyData[historyData.length - 1];
        const lastMsg = historyData[historyData.length - 2];
        
        const currentTime = new Date(currentMsg.timestamp).getTime();
        const lastTime = new Date(lastMsg.timestamp).getTime();
        const hoursDiff = (currentTime - lastTime) / (1000 * 60 * 60);
        
        // If the last conversation was more than 4 hours ago, start fresh
        // Otherwise, include the last 10 messages for context
        if (hoursDiff < 4) {
          contextHistory = historyData.slice(-11, -1).map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.message }]
          }));
        } else {
          console.log("Long gap detected (>4h), starting fresh conversation context.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch history for context:", err);
      // Fallback to current session messages (excluding the one just sent)
      contextHistory = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.message }]
      }));
    }

    const botReply = await getChatbotResponse(user?.name || 'Friend', botName, userMsg, contextHistory, isProactive);
    
    const botChatRes = await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: botReply, sender: 'bot' }),
    });
    const botChat = await botChatRes.json();
    
    setIsTyping(false);
    setMessages(prev => [...prev, botChat]);
  };

  const filteredHistory = historyMessages.filter(msg => {
    const matchesSearch = msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSender = senderFilter === 'all' || msg.sender === senderFilter;
    
    const msgDate = new Date(msg.timestamp);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // Set end date to end of day
    if (end) end.setHours(23, 59, 59, 999);
    
    const matchesStartDate = !start || msgDate >= start;
    const matchesEndDate = !end || msgDate <= end;
    
    return matchesSearch && matchesSender && matchesStartDate && matchesEndDate;
  });

  const displayedMessages = showHistory ? filteredHistory : messages;

  const clearFilters = () => {
    setSearchQuery('');
    setSenderFilter('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 font-serif">{botName}</h2>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-green-500 font-medium flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Online Psychologist
              </p>
              {dbStatus === 'offline' && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-bold rounded-full uppercase tracking-wider border border-amber-200">
                  Offline Mode
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              showHistory 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-primary border-primary/20 hover:bg-primary/5'
            }`}
          >
            {showHistory ? 'Back to Chat' : 'View History'}
          </button>
          <div className="hidden md:flex items-center space-x-2 bg-primary/5 px-3 py-1.5 rounded-full">
            <Zap className={`h-4 w-4 ${isProactive ? 'text-primary' : 'text-gray-400'}`} />
            <span className="text-xs font-bold text-primary/80">Proactive Mode</span>
            <button 
              onClick={() => setIsProactive(!isProactive)}
              className={`w-8 h-4 rounded-full transition-colors relative ${isProactive ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isProactive ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:text-primary transition-colors">
            <Phone className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {showHistory && (
          <div className="space-y-4 mb-6">
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center">
              <p className="text-sm text-primary/80 font-medium">
                You are viewing your <strong>Full Chat History</strong>. 
                Switch back to "Chat" to start a fresh conversation.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <select
                    value={senderFilter}
                    onChange={(e) => setSenderFilter(e.target.value as any)}
                    className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                  >
                    <option value="all">All Senders</option>
                    <option value="user">You</option>
                    <option value="bot">AI Psychologist</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <span className="text-gray-400 text-sm">to</span>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                {(searchQuery || senderFilter !== 'all' || startDate || endDate) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-1 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {displayedMessages.length === 0 && (
          <div className="text-center py-10">
            <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">
              {showHistory ? 'No history found' : `Hello ${user?.name}!`}
            </h3>
            <p className="text-gray-500">
              {showHistory 
                ? 'Your previous conversations will appear here once you start chatting.' 
                : `I'm ${botName}, your personal AI psychologist. \n How are you feeling today?`}
            </p>
          </div>
        )}

        {displayedMessages.map((msg, i) => (
          <motion.div
            key={msg._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-primary/10 ml-2' : 'bg-gray-200 mr-2'
              }`}>
                {msg.sender === 'user' ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-gray-600" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
              }`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                </div>
                <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && !showHistory && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-xs text-gray-400 font-medium">{botName} is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Crisis Alert Modal */}
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-t-8 border-red-500"
            >
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <AlertCircle className="h-8 w-8" />
                <h2 className="text-2xl font-bold">We're here for you</h2>
              </div>
              <p className="text-gray-600 mb-6">
                It sounds like you're going through a very difficult time. Please know that you're not alone and there are people who want to help.
              </p>
              <div className="space-y-4 mb-8">
                <div className="bg-red-50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-red-700">National Suicide Prevention</p>
                    <p className="text-xl font-black text-red-600">988</p>
                  </div>
                  <a href="tel:988" className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-colors">
                    <Phone className="h-6 w-6" />
                  </a>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary/80">Crisis Text Line</p>
                    <p className="text-xl font-black text-primary">Text HOME to 741741</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCrisisAlert(false)}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                I understand, thank you
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center space-x-2">
          <input
            type="text"
            disabled={showHistory}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={showHistory ? "Switch back to chat to message..." : `Message ${botName}...`}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || showHistory}
            className="bg-primary text-white p-4 rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {isTyping ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
