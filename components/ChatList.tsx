'use client';

import { useChatContext } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatList() {
  const { 
    currentChannel, 
    currentChat, 
    setCurrentChat, 
    createNewChat, 
    deleteChat,
    toggleChatList 
  } = useChatContext();

  // Animations
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    }),
    hover: { 
      x: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
          <span className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
            <span className="mr-2">{currentChannel.iconEmoji}</span>
            {currentChannel.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <motion.button 
            onClick={createNewChat}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            aria-label="Create new chat"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>
          
          <motion.button 
            onClick={toggleChatList}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            aria-label="Toggle chat list"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence>
          {currentChannel.chats.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full px-4 py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-4xl mb-3">💬</div>
              <p className="text-center text-slate-600 dark:text-slate-400">
                No chats yet. Create a new chat to get started.
              </p>
              <motion.button
                onClick={createNewChat}
                className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Chat
              </motion.button>
            </motion.div>
          ) : (
            <ul className="space-y-1">
              {currentChannel.chats.map((chat, i) => (
                <motion.li 
                  key={chat.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  layout
                >
                  <div className={`
                    flex items-center rounded-md p-2 px-3 transition-all duration-200
                    ${currentChat && currentChat.id === chat.id 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}
                  `}>
                    <button
                      onClick={() => setCurrentChat(chat.id)}
                      className="flex-1 flex items-center text-left overflow-hidden"
                    >
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mr-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium truncate">{chat.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {chat.messages.length > 0 
                            ? chat.messages[chat.messages.length - 1].text.substring(0, 30) + (chat.messages[chat.messages.length - 1].text.length > 30 ? '...' : '')
                            : 'No messages yet'}
                        </div>
                      </div>
                    </button>
                    
                    <motion.button 
                      onClick={() => deleteChat(chat.id)}
                      className="ml-2 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400"
                      aria-label="Delete chat"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}