
import React from 'react';
import { Character, ChatMessage as ChatMessageType } from '@/types';
import { CircleCheckIcon, ClockIcon, Sparkles, AlertTriangleIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
  character: Character;
  formatTime: (timestamp: number) => string;
  isTyping?: boolean;
  isError?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  character, 
  formatTime,
  isTyping = false,
  isError = false
}) => {
  return (
    <div
      className={`flex ${
        message.isUser ? 'justify-end' : 'justify-start'
      } animate-fade-in my-4`}
    >
      {!message.isUser && (
        <div className="flex-shrink-0 mr-3 mt-1">
          <div className="avatar-container">
            <img 
              src={character.imageUrl || '/placeholder.svg'} 
              alt={character.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-accent1/40 shadow-lg transform hover:rotate-3 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 border border-accent1/30 shadow-md">
              <Sparkles className="h-3 w-3 text-accent1 animate-pulse-soft" />
            </div>
          </div>
        </div>
      )}
      
      <div
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] ${
          message.isUser
            ? 'bg-accent1/10 border-2 border-accent1/20 rounded-2xl rounded-tr-sm text-foreground transform rotate-0.5deg shadow-accent1/10'
            : 'bg-background/90 border-2 border-border/70 rounded-2xl rounded-tl-sm transform -rotate-0.5deg shadow-lg'
        } shadow-lg flex flex-col paper-texture relative overflow-hidden`}
      >
        {/* Message shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none opacity-70
                       animate-[shine_3s_ease-in-out_infinite] -translate-x-full"></div>
                       
        <style>
          {`
            @keyframes shine {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(100%); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>
        
        {/* Decorative corner elements for character messages */}
        {!message.isUser && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent1/30 rounded-tl-md"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent1/30 rounded-tr-md"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent1/30 rounded-bl-md"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent1/30 rounded-br-md"></div>
          </>
        )}
        
        {/* Decorative corner elements for user messages */}
        {message.isUser && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent1/30 rounded-tl-md"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent1/30 rounded-tr-md"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent1/30 rounded-bl-md"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent1/30 rounded-br-md"></div>
          </>
        )}
        
        {!message.isUser && (
          <div className="px-4 pt-2 text-sm font-medium flex items-center">
            <span className="text-accent1 wavy-decoration">{character.name}</span>
          </div>
        )}
        
        <div className="px-4 py-3 relative">
          <div className="text-sm markdown-content">
            {isTyping ? (
              <>
                {message.content}
                <span className="typing-indicator ml-1">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        </div>
        
        <div
          className={`px-4 pb-1.5 text-xs text-muted-foreground flex items-center gap-1 ${
            message.isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          {isTyping ? (
            <>
              <ClockIcon className="h-3 w-3" />
              <span>Typing...</span>
            </>
          ) : isError ? (
            <>
              <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
              <span className="text-amber-500">Connection issue</span>
            </>
          ) : (
            <>
              <CircleCheckIcon className="h-3 w-3" />
              <span>{formatTime(message.timestamp)}</span>
            </>
          )}
        </div>
        
        {/* Small inline error notification */}
        {isError && (
          <div className="mx-4 mb-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-500 flex items-center">
            <AlertTriangleIcon className="h-3 w-3 mr-1" />
            <span>Check if Ollama is running</span>
          </div>
        )}
      </div>
      
      {message.isUser && (
        <div className="flex-shrink-0 ml-3 mt-1">
          <div className="h-10 w-10 rounded-full bg-accent1/15 border-2 border-accent1/40 flex items-center justify-center text-sm font-medium text-accent1 transform hover:-rotate-3 transition-transform shadow-md">
            You
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
