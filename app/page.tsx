'use client';

import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatList from '../components/ChatList';
import ChatHeader from '../components/ChatHeader';
import ChatArea from '../components/ChatArea';
import ChatInput from '../components/ChatInput';
import { useChatContext } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { darkMode, isMobileSidebarOpen, isChatListOpen, currentChat } = useChatContext();

  // Add class to body for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sidebar animation variants
  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { 
        type: 'spring', 
        damping: 30, 
        stiffness: 300
      }
    }
  };

  // Chat list animation variants
  const chatListVariants = {
    hidden: { 
      x: '-100%', 
      opacity: 0,
      transition: { duration: 0.3 }
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 300,
        delay: 0.1
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Content area animation variants
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - always visible */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Chat list section - conditionally visible */}
      <AnimatePresence mode="wait">
        {isChatListOpen && (
          <motion.div 
            className="w-full sm:w-72 md:w-80 border-r border-slate-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800 z-10"
            variants={chatListVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="chatList"
          >
            <ChatList />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <motion.div 
        className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        key="chatArea"
      >
        <ChatHeader />
        {currentChat ? (
          <>
            <ChatArea />
            <ChatInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <motion.div 
              className="text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-6">👈</div>
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Select a Channel</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Choose an AI assistant from the sidebar and click the "+" button next to it to start a new chat. Each assistant is specialized to help with different tasks.
              </p>
              {/* "Create New Chat" button removed */}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}