
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Character, ChatMessage } from '@/types';
import { useCharacter } from '@/contexts/CharacterContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowUp } from 'lucide-react';
import ollamaService from '@/services/ollamaService';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  character: Character;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ character }) => {
  const { conversations, addMessage, modelConfig } = useCharacter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const messages = conversations[character.id] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSystemPrompt = () => {
    const { personality } = character;
    return `You are roleplaying as ${character.name}. ${character.description}
    
Your personality settings:
- Kinkiness: ${personality.kinkiness}% (${personality.kinkiness < 30 ? 'low' : personality.kinkiness > 70 ? 'high' : 'moderate'})
- Dominance: ${personality.dominance}% (${personality.dominance < 30 ? 'low' : personality.dominance > 70 ? 'high' : 'moderate'})
- Submissiveness: ${personality.submissiveness}% (${personality.submissiveness < 30 ? 'low' : personality.submissiveness > 70 ? 'high' : 'moderate'})

Stay in character at all times. Keep your responses relatively concise. Be creative and engaging.`;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    addMessage(character.id, userMessage, true);
    setIsLoading(true);
    
    try {
      // Convert existing messages to a format the LLM can understand
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      }));
      
      ollamaService.setModel(modelConfig.llm.name);
      const response = await ollamaService.generateResponse(
        userMessage,
        generateSystemPrompt(),
        conversationHistory
      );
      
      addMessage(character.id, response, false);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="mb-4 glass-morphism p-4 rounded-full">
              <img 
                src={character.imageUrl || '/placeholder.svg'} 
                alt={character.name} 
                className="h-20 w-20 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <h3 className="text-xl font-semibold text-gradient">{character.name}</h3>
            <p className="text-muted-foreground mt-2">{character.description}</p>
            <p className="text-sm text-muted-foreground mt-4 glass-morphism p-4 rounded-lg">
              Send a message to start chatting with {character.name}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isUser ? 'justify-end' : 'justify-start'
                } animate-slide-in`}
                style={{ 
                  animationDelay: `${Math.min(index * 0.05, 0.3)}s`, 
                  opacity: 0 
                }}
              >
                <div
                  className={`max-w-[80%] ${
                    msg.isUser
                      ? 'bg-accent1/30 glass-morphism rounded-2xl rounded-tr-sm'
                      : 'bg-secondary glass-morphism rounded-2xl rounded-tl-sm'
                  }`}
                >
                  <div className="p-3">
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <div
                    className={`px-3 pb-1 text-xs text-white/50 flex ${
                      msg.isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Card className="border-t glass-morphism mt-auto">
        <CardContent className="p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${character.name}...`}
              className="flex-1 min-h-[50px] max-h-[150px] glass-morphism resize-none"
              disabled={isLoading}
            />
            <Button
              className={`rounded-full h-10 w-10 p-0 shrink-0 ${
                isLoading || !message.trim()
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-accent1 hover:bg-accent1/80'
              }`}
              disabled={isLoading || !message.trim()}
              onClick={handleSendMessage}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
