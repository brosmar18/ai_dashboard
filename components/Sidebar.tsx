'use client';

import { useState } from 'react';
import { useChatContext, AIChannel } from '../context/ChatContext'; // Import AIChannel type
import { motion } from 'framer-motion';

// Icons
const SunIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export default function Sidebar() {
  const {
    channels,
    currentChannel,
    setCurrentChannel,
    darkMode,
    toggleDarkMode,
    createNewChat
  } = useChatContext();

  // Helper function to handle color classes with proper types
  const getChannelClasses = (channel: AIChannel, isActive: boolean) => {
    const colorMap: Record<string, {
      active: string;
      hover: string;
      icon: string;
    }> = {
      'emerald': {
        active: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
        hover: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
        icon: 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400'
      },
      'blue': {
        active: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
        hover: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
        icon: 'bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-400'
      },
      'purple': {
        active: 'bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
        hover: 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
        icon: 'bg-purple-100 dark:bg-purple-800/40 text-purple-600 dark:text-purple-400'
      }
    };

    // Safely access the color with fallback to 'emerald'
    const colorKey = channel.color as keyof typeof colorMap;
    const colorConfig = colorMap[colorKey] || colorMap['emerald'];

    return {
      button: isActive ? colorConfig.active : colorConfig.hover,
      icon: colorConfig.icon
    };
  };

  // Animation for channel items
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }),
    hover: {
      scale: 1.03,
      x: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };

  // Logo animation
  const logoVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1]
      }
    }
  };

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
        <motion.div
          className="flex items-center space-x-2"
          variants={logoVariants}
          initial="initial"
          whileHover="animate"
        >
          <span className="text-2xl">🤖</span>
          <span className="text-xl font-semibold tracking-wide bg-gradient-to-r from-emerald-500 to-blue-500 text-transparent bg-clip-text">AI Chat Hub</span>
        </motion.div>

        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </motion.button>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Assistants</h2>
        </div>
        <ul className="space-y-3">
          {channels.map((channel, i) => {
            const classes = getChannelClasses(channel, channel.isActive);

            return (
              <motion.li
                key={channel.id}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
              >
                <div className="flex items-center">
                  <button
                    onClick={() => setCurrentChannel(channel.id)}
                    className={`flex-1 flex items-center px-3 py-3 rounded-lg transition-all duration-300 ${classes.button}`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${classes.icon} mr-3`}>
                      <span className="text-2xl">{channel.iconEmoji}</span>
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium">{channel.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{channel.description}</div>
                    </div>
                  </button>

                  <motion.button
                    onClick={() => {
                      setCurrentChannel(channel.id);
                      createNewChat();
                    }}
                    className="ml-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Create new chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.button>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700">
        <motion.div
          className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h3 className="font-medium text-sm mb-1">Need Help?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Click on an AI assistant to start chatting or create a new conversation.</p>
        </motion.div>
      </div>
    </aside>
  );
}