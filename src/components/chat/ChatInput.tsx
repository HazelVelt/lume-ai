
import React, { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2 } from 'lucide-react';
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
    <Card className="border-t border-accent1/20 bg-background/70 backdrop-blur-sm sticky bottom-0 z-10 shadow-md rounded-none">
      <CardContent className="p-3">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${characterName}...`}
              className="min-h-[50px] max-h-[150px] pr-10 bg-background/80 border-accent1/20 resize-none shadow-inner rounded-lg"
              disabled={isLoading || isTyping}
            />
            <Button
              className={`absolute right-2 bottom-2 rounded-full h-8 w-8 p-0 ${
                isLoading || isTyping || !message.trim()
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-accent1 hover:bg-accent1/80 shadow-md'
              }`}
              disabled={isLoading || isTyping || !message.trim()}
              onClick={handleSendMessage}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInput;
