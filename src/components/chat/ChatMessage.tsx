
import React from 'react';
import { Character, ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  character: Character;
  formatTime: (timestamp: number) => string;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  character, 
  formatTime,
  isTyping = false 
}) => {
  return (
    <div
      className={`flex ${
        message.isUser ? 'justify-end' : 'justify-start'
      } animate-fade-in my-2`}
    >
      {!message.isUser && (
        <div className="flex-shrink-0 mr-2">
          <img 
            src={character.imageUrl || '/placeholder.svg'} 
            alt={character.name}
            className="h-8 w-8 rounded-full object-cover border border-accent1/30 shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      )}
      
      <div
        className={`max-w-[85%] ${
          message.isUser
            ? 'bg-accent1/15 border border-accent1/20 rounded-2xl rounded-tr-sm text-foreground'
            : 'bg-background/90 border border-border rounded-2xl rounded-tl-sm'
        } shadow-sm flex flex-col`}
      >
        {!message.isUser && (
          <div className="px-3 pt-2 text-sm font-medium flex items-center">
            {character.name}
          </div>
        )}
        
        <div className="px-3 py-2">
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
            {isTyping && <span className="animate-pulse ml-1">▋</span>}
          </div>
        </div>
        
        <div
          className={`px-3 pb-1 text-xs text-muted-foreground flex ${
            message.isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
      
      {message.isUser && (
        <div className="flex-shrink-0 ml-2">
          <div className="h-8 w-8 rounded-full bg-accent1/15 border border-accent1/20 flex items-center justify-center text-sm font-medium text-accent1">
            You
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
