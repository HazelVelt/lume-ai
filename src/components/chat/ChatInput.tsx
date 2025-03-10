
import React, { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isTyping: boolean;
  characterName: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSendMessage,
  isLoading,
  isTyping,
  characterName,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="border-t border-accent1/20 glass-morphism fixed bottom-0 left-0 right-0 z-20 shadow-lg rounded-none">
      <CardContent className="p-3 max-w-5xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${characterName}...`}
              className="min-h-[50px] max-h-[150px] pr-12 bg-background/80 border-accent1/20 
                        resize-none shadow-inner rounded-lg focus-visible:ring-accent1/40 
                        transition-all duration-200"
              disabled={isLoading || isTyping}
            />
            
            {/* Decorative corner elements for textarea */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent1/40 opacity-50 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent1/40 opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent1/40 opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent1/40 opacity-50 pointer-events-none"></div>
            
            <Button
              className={`absolute right-2.5 bottom-2.5 rounded-full h-8 w-8 p-0 transition-all duration-300 
                         ${isLoading || isTyping || !message.trim()
                           ? 'bg-muted text-muted-foreground'
                           : 'bg-accent1 hover:bg-accent1/80 shadow-accent1/25 shadow-md'
                         } overflow-hidden group`}
              disabled={isLoading || isTyping || !message.trim()}
              onClick={handleSendMessage}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ArrowUp className="h-4 w-4 transition-all duration-300 group-hover:translate-y-[-20px]" />
                  <Sparkles className="h-4 w-4 absolute transition-all duration-300 translate-y-[20px] group-hover:translate-y-0" />
                </>
              )}
              
              {/* Radial gradient background for button - enhanced hover effect */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent1/20 to-accent1/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInput;
