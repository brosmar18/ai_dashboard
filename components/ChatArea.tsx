'use client';

import { useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

// Empty state component
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8">
    <motion.div 
      className="flex flex-col items-center text-center max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="text-6xl mb-6">💬</div>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Start the Conversation</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Ask a question or describe what you need help with. Our AI assistant is ready to help!
      </p>
    </motion.div>
  </div>
);

// Message bubble component
const MessageBubble = ({ message, index }: { message: any, index: number }) => {
  const isAI = !message.isUser;
  
  // Different animation variants based on message sender
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      x: isAI ? -20 : 20,
      y: 10
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        delay: index * 0.1 // stagger effect
      }
    }
  };

  return (
    <motion.div 
      className={`flex mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <div 
        className={`max-w-3/4 md:max-w-md lg:max-w-lg px-4 py-3 rounded-t-xl ${
          isAI 
            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-br-xl rounded-bl-none shadow-sm border border-slate-200 dark:border-slate-700' 
            : 'bg-emerald-500 text-white rounded-bl-xl rounded-br-none'
        }`}
      >
        <div className={`font-medium mb-1 text-xs ${isAI ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-50'}`}>
          {isAI ? 'AI Assistant' : 'You'}
        </div>
        <div>{message.text}</div>
        <div className={`text-right mt-1 text-xs ${isAI ? 'text-slate-400 dark:text-slate-500' : 'text-emerald-100'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
    </motion.div>
  );
};

// Typing indicator component
const TypingIndicator = () => (
  <motion.div
    className="flex items-center p-4 mb-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
  >
    <div className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">AI is thinking...</span>
      </div>
    </div>
  </motion.div>
);

export default function ChatArea() {
  const { currentChat, isTyping } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChat?.messages, isTyping]);

  if (!currentChat) return <EmptyState />;

  // 3D scroll animation for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {currentChat.messages.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="pb-2"
        >
          {currentChat.messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
        </motion.div>
      )}
      
      <AnimatePresence>
        {isTyping && <TypingIndicator />}
      </AnimatePresence>
      
      <div ref={messagesEndRef} />
    </div>
  );
}