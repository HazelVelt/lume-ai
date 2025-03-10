
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
  onReturn: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ character, onReturn }) => {
  const { conversations, addMessage, modelConfig } = useCharacter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const messages = conversations[character.id] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  const generateSystemPrompt = () => {
    const { personality } = character;
    
    const allTraits = [
      `Kinkiness: ${personality.kinkiness}% (${personality.kinkiness < 30 ? 'low' : personality.kinkiness > 70 ? 'high' : 'moderate'})`,
      `Dominance: ${personality.dominance}% (${personality.dominance < 30 ? 'low' : personality.dominance > 70 ? 'high' : 'moderate'})`,
      `Submissiveness: ${personality.submissiveness}% (${personality.submissiveness < 30 ? 'low' : personality.submissiveness > 70 ? 'high' : 'moderate'})`,
    ];
    
    if (personality.intelligence !== undefined) {
      allTraits.push(`Intelligence: ${personality.intelligence}% (${personality.intelligence < 30 ? 'low' : personality.intelligence > 70 ? 'high' : 'moderate'})`);
    }
    
    if (personality.empathy !== undefined) {
      allTraits.push(`Empathy: ${personality.empathy}% (${personality.empathy < 30 ? 'low' : personality.empathy > 70 ? 'high' : 'moderate'})`);
    }
    
    if (personality.creativity !== undefined) {
      allTraits.push(`Creativity: ${personality.creativity}% (${personality.creativity < 30 ? 'low' : personality.creativity > 70 ? 'high' : 'moderate'})`);
    }
    
    if (personality.humor !== undefined) {
      allTraits.push(`Humor: ${personality.humor}% (${personality.humor < 30 ? 'low' : personality.humor > 70 ? 'high' : 'moderate'})`);
    }
    
    return `You are roleplaying as ${character.name}. ${character.description}
    
Your personality settings:
${allTraits.map(trait => `- ${trait}`).join('\n')}

Adjust your responses to reflect these traits:
${personality.kinkiness > 70 ? '- Be more suggestive and flirtatious' : personality.kinkiness < 30 ? '- Keep responses clean and proper' : '- Be moderately suggestive when appropriate'}
${personality.dominance > 70 ? '- Take charge in the conversation, be assertive' : ''}
${personality.submissiveness > 70 ? '- Be agreeable and acquiescent in your tone' : ''}
${personality.intelligence !== undefined && personality.intelligence > 70 ? '- Use sophisticated vocabulary and complex ideas' : ''}
${personality.intelligence !== undefined && personality.intelligence < 30 ? '- Keep your language and ideas simple' : ''}
${personality.empathy !== undefined && personality.empathy > 70 ? '- Show deep understanding and care for emotions' : ''}
${personality.creativity !== undefined && personality.creativity > 70 ? '- Be imaginative and original in your responses' : ''}
${personality.humor !== undefined && personality.humor > 70 ? '- Incorporate humor and wit into your responses' : ''}

${character.defaultPrompt ? `Additional context: ${character.defaultPrompt}` : ''}

Stay in character at all times. Keep your responses relatively concise. Be creative and engaging.`;
  };

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    setTypingMessage('');
    
    let i = 0;
    const typingSpeed = 5; // Faster typing (reduced from 10)
    
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypingMessage(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        addMessage(character.id, text, false);
        setTypingMessage('');
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    addMessage(character.id, userMessage, true);
    setIsLoading(true);
    
    try {
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
      
      simulateTyping(response);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response', {
        duration: 2000,
      });
      setIsLoading(false);
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
    <div className="flex flex-col h-full overflow-hidden">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-none"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="mb-4 glass-morphism p-4 rounded-full relative avatar-container">
              <img 
                src={character.imageUrl || '/character-placeholder.jpg'} 
                alt={character.name} 
                className="h-20 w-20 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/character-placeholder.jpg';
                }}
              />
              <div className="ripple-container">
                <div className="ripple-circle"></div>
                <div className="ripple-circle" style={{ animationDelay: "1s" }}></div>
                <div className="ripple-circle" style={{ animationDelay: "2s" }}></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gradient">{character.name}</h3>
            <p className="text-muted-foreground mt-2">{character.description}</p>
            <p className="text-sm text-muted-foreground mt-4 glass-morphism p-4 rounded-lg">
              Send a message to start chatting with {character.name}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isUser ? 'justify-end' : 'justify-start'
                } animate-fade-in`}
              >
                {!msg.isUser && (
                  <div className="flex flex-col items-center mr-2">
                    <img 
                      src={character.imageUrl || '/placeholder.svg'} 
                      alt={character.name}
                      className="h-8 w-8 rounded-full object-cover mb-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] ${
                    msg.isUser
                      ? 'bg-accent1/30 glass-morphism rounded-2xl rounded-tr-sm'
                      : 'bg-secondary glass-morphism rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {!msg.isUser && (
                    <div className="px-3 pt-2 text-sm font-medium">
                      {character.name}
                    </div>
                  )}
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
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex flex-col items-center mr-2">
                  <img 
                    src={character.imageUrl || '/placeholder.svg'} 
                    alt={character.name}
                    className="h-8 w-8 rounded-full object-cover mb-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="max-w-[80%] bg-secondary glass-morphism rounded-2xl rounded-tl-sm">
                  <div className="px-3 pt-2 text-sm font-medium">
                    {character.name}
                  </div>
                  <div className="p-3">
                    <div className="text-sm whitespace-pre-wrap">{typingMessage}<span className="animate-pulse">▋</span></div>
                  </div>
                  <div className="px-3 pb-1 text-xs text-white/50 flex justify-start">
                    {formatTime(Date.now())}
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Card className="border-t glass-morphism sticky bottom-0 z-10">
        <CardContent className="p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${character.name}...`}
              className="flex-1 min-h-[50px] max-h-[150px] glass-morphism resize-none"
              disabled={isLoading || isTyping}
            />
            <Button
              className={`rounded-full h-10 w-10 p-0 shrink-0 ${
                isLoading || isTyping || !message.trim()
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-accent1 hover:bg-accent1/80'
              }`}
              disabled={isLoading || isTyping || !message.trim()}
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
