'use client';

import { useChatContext, AIChannel } from '../context/ChatContext'; 
import { motion } from 'framer-motion';

export default function ChatHeader() {
  const {
    currentChannel,
    currentChat,
    toggleMobileSidebar,
    toggleChatList
  } = useChatContext();

  // Add helper function to handle color classes with proper types
  const getColorClasses = (channel: AIChannel): string => {
    const colorMap: Record<string, string> = {
      'emerald': 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400',
      'blue': 'bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-400',
      'purple': 'bg-purple-100 dark:bg-purple-800/40 text-purple-600 dark:text-purple-400'
    };

    // Safely access the color with fallback to 'emerald'
    const colorKey = channel.color as keyof typeof colorMap;
    return colorMap[colorKey] || colorMap['emerald'];
  };

  if (!currentChat) {
    return (
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center">
          <motion.button
            onClick={toggleMobileSidebar}
            className="md:hidden mr-3 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
            aria-label="Toggle sidebar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>

          <motion.button
            onClick={toggleChatList}
            className="flex items-center mr-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>

          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${getColorClasses(currentChannel)} mr-2`}>
              <span className="text-xl">{currentChannel.iconEmoji}</span>
            </div>
            <h1 className="text-lg font-medium text-slate-900 dark:text-white">
              {currentChannel.name}
            </h1>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center">
        <motion.button
          onClick={toggleMobileSidebar}
          className="md:hidden mr-3 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          aria-label="Toggle sidebar"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>

        <motion.button
          onClick={toggleChatList}
          className="hidden sm:flex sm:items-center mr-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        <div>
          <div className="flex items-center">
            <motion.div
              className={`flex items-center justify-center w-8 h-8 rounded-lg ${getColorClasses(currentChannel)} mr-2`}
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xl">{currentChannel.iconEmoji}</span>
            </motion.div>
            <h1 className="text-lg font-medium text-slate-900 dark:text-white">{currentChat.name}</h1>
            <button className="ml-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{currentChannel.description}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}