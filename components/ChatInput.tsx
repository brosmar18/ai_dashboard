'use client';
import { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatInput() {
  const [messageText, setMessageText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { currentChat, sendMessage } = useChatContext();
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !currentChat || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await sendMessage(messageText);
      
      setMessageText('');
      setIsExpanded(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const inputVariants = {
    normal: { 
      height: '50px',
      transition: { duration: 0.2 }
    },
    expanded: { 
      height: '100px',
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  if (!currentChat) return null;

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 transition-colors duration-200">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div 
          className="flex items-center space-x-2 relative"
          animate={isExpanded ? "expanded" : "normal"}
          variants={inputVariants}
        >
          <div className="relative flex-1">
            <motion.textarea
              ref={inputRef}
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                setIsExpanded(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200 resize-none disabled:opacity-70"
              style={{ height: isExpanded ? '100px' : '50px' }}
            />
            
            <AnimatePresence>
              {messageText.trim().length > 0 && !isLoading && (
                <motion.button
                  type="button"
                  onClick={() => setMessageText('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 transition-colors duration-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            type="submit"
            className="bg-emerald-600 dark:bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
            disabled={!messageText.trim() || isLoading}
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="mt-2 ml-1 text-xs text-slate-500 dark:text-slate-400 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </motion.div>
      </form>
    </div>
  );
}