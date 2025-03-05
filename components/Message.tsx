'use client';

import { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { User } from '../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageProps {
  id: string;
  text: string;
  sender: User;
  timestamp: Date;
  isMine: boolean;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

export default function Message({ id, text, sender, timestamp, isMine, reactions }: MessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { darkMode } = useChatContext();
  
  // Format the message text with mentions and links
  const formatMessageText = (text: string) => {
    // Replace @mentions with styled spans
    const mentionRegex = /@(\w+)/g;
    const withMentions = text.replace(mentionRegex, '<span class="text-emerald-600 dark:text-emerald-400 font-medium">@$1</span>');
    
    // Replace URLs with clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return withMentions.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline">$1</a>');
  };

  // Process emojis in the message
  const processEmojis = (text: string) => {
    const emojiRegex = /(:[\w]+:)/g;
    return text.replace(emojiRegex, (match) => {
      // Map emoji codes to actual emojis
      const emojiMap: Record<string, string> = {
        ':smile:': '😊',
        ':laugh:': '😂',
        ':heart:': '❤️',
        ':thumbsup:': '👍',
        ':fire:': '🔥',
      };
      return emojiMap[match] || match;
    });
  };

  const formattedText = processEmojis(formatMessageText(text));

  return (
    <div 
      className={`group flex items-start space-x-3 ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative flex-shrink-0">
        <div className="h-9 w-9 rounded-full overflow-hidden">
          <Image 
            src={sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sender.name)}&background=random`} 
            alt={sender.name}
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-800 ${
          sender.status === 'online' ? 'bg-emerald-400' :
          sender.status === 'away' ? 'bg-amber-400' : 'bg-slate-400'
        }`} />
      </div>

      <div className={`flex-1 max-w-3xl ${isMine ? 'text-right' : ''}`}>
        <div className={`flex items-baseline space-x-2 mb-1 ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className={`font-medium ${isMine ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
            {isMine ? 'You' : sender.name}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
        </div>

        <div className={`relative ${isMine ? 'ml-auto' : 'mr-auto'}`}>
          <div 
            className={`inline-block p-3 rounded-lg ${
              isMine 
                ? 'bg-emerald-500 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
            } shadow-sm hover:shadow transition-shadow duration-200 max-w-lg`}
          >
            <p className="text-sm" dangerouslySetInnerHTML={{ __html: formattedText }} />
          </div>

          {/* Reaction bar */}
          {reactions && reactions.length > 0 && (
            <div className={`flex mt-1 space-x-1 text-sm ${isMine ? 'justify-end' : 'justify-start'}`}>
              {reactions.map((reaction, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Message actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`absolute ${isMine ? 'right-0 -top-8' : 'left-0 -top-8'} flex bg-white dark:bg-slate-800 rounded-md shadow-md`}
              >
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-l-md transition-colors duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-r-md transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`absolute ${isMine ? 'right-0 -bottom-12' : 'left-0 -bottom-12'} bg-white dark:bg-slate-800 p-2 rounded-md shadow-lg flex space-x-2`}
              >
                {['👍', '❤️', '😂', '😲', '😢', '🔥'].map(emoji => (
                  <button 
                    key={emoji} 
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors duration-200"
                    onClick={() => setShowEmojiPicker(false)}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}