
import React, { useState, useRef, useEffect } from 'react';
import { Character } from '@/types';
import { useCharacter } from '@/contexts/CharacterContext';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import WelcomeMessage from '@/components/chat/WelcomeMessage';
import ollamaService from '@/services/ollamaService';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  character: Character;
  onReturn: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ character }) => {
  const { conversations, addMessage, modelConfig } = useCharacter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const messages = conversations[character.id] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Handle scrolling when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Small delay to ensure DOM is updated
    
    return () => clearTimeout(timer);
  }, [messages, typingMessage, errorMessage]);

  const generateSystemPrompt = () => {
    const { personality } = character;
    
    const allTraits = [
      // Core traits
      `Kinkiness: ${personality.kinkiness}% (${personality.kinkiness < 30 ? 'low' : personality.kinkiness > 70 ? 'high' : 'moderate'})`,
      `Dominance: ${personality.dominance}% (${personality.dominance < 30 ? 'low' : personality.dominance > 70 ? 'high' : 'moderate'})`,
      `Submissiveness: ${personality.submissiveness}% (${personality.submissiveness < 30 ? 'low' : personality.submissiveness > 70 ? 'high' : 'moderate'})`,
      `Intelligence: ${personality.intelligence}% (${personality.intelligence < 30 ? 'low' : personality.intelligence > 70 ? 'high' : 'moderate'})`,
      `Empathy: ${personality.empathy}% (${personality.empathy < 30 ? 'low' : personality.empathy > 70 ? 'high' : 'moderate'})`,
      `Creativity: ${personality.creativity}% (${personality.creativity < 30 ? 'low' : personality.creativity > 70 ? 'high' : 'moderate'})`,
      `Humor: ${personality.humor}% (${personality.humor < 30 ? 'low' : personality.humor > 70 ? 'high' : 'moderate'})`,
      `Confidence: ${personality.confidence}% (${personality.confidence < 30 ? 'low' : personality.confidence > 70 ? 'high' : 'moderate'})`,
      `Curiosity: ${personality.curiosity}% (${personality.curiosity < 30 ? 'low' : personality.curiosity > 70 ? 'high' : 'moderate'})`,
      `Reliability: ${personality.reliability}% (${personality.reliability < 30 ? 'low' : personality.reliability > 70 ? 'high' : 'moderate'})`,
    ];
    
    // Add new NSFW traits if they exist in the character personality
    if (personality.passion !== undefined) {
      allTraits.push(`Passion: ${personality.passion}% (${personality.passion < 30 ? 'low' : personality.passion > 70 ? 'high' : 'moderate'})`);
    }
    
    if (personality.sensuality !== undefined) {
      allTraits.push(`Sensuality: ${personality.sensuality}% (${personality.sensuality < 30 ? 'low' : personality.sensuality > 70 ? 'high' : 'moderate'})`);
    }
    
    if (personality.flirtatiousness !== undefined) {
      allTraits.push(`Flirtatiousness: ${personality.flirtatiousness}% (${personality.flirtatiousness < 30 ? 'low' : personality.flirtatiousness > 70 ? 'high' : 'moderate'})`);
    }
    
    if (personality.adventurousness !== undefined) {
      allTraits.push(`Adventurousness: ${personality.adventurousness}% (${personality.adventurousness < 30 ? 'low' : personality.adventurousness > 70 ? 'high' : 'moderate'})`);
    }
    
    if (personality.intensity !== undefined) {
      allTraits.push(`Intensity: ${personality.intensity}% (${personality.intensity < 30 ? 'low' : personality.intensity > 70 ? 'high' : 'moderate'})`);
    }
    
    return `You are roleplaying as ${character.name}. ${character.description}
    
Your personality settings:
${allTraits.map(trait => `- ${trait}`).join('\n')}

Adjust your responses to reflect these traits:
${personality.kinkiness > 70 ? '- Be more suggestive and flirtatious' : personality.kinkiness < 30 ? '- Keep responses clean and proper' : '- Be moderately suggestive when appropriate'}
${personality.dominance > 70 ? '- Take charge in the conversation, be assertive' : ''}
${personality.submissiveness > 70 ? '- Be agreeable and acquiescent in your tone' : ''}
${personality.intelligence > 70 ? '- Use sophisticated vocabulary and complex ideas' : personality.intelligence < 30 ? '- Keep your language and ideas simple' : ''}
${personality.empathy > 70 ? '- Show deep understanding and care for emotions' : personality.empathy < 30 ? '- Be more logical and less emotional' : ''}
${personality.creativity > 70 ? '- Be imaginative and original in your responses' : personality.creativity < 30 ? '- Be straightforward and literal' : ''}
${personality.humor > 70 ? '- Incorporate humor and wit into your responses' : personality.humor < 30 ? '- Be serious and straightforward' : ''}
${personality.confidence !== undefined && personality.confidence > 70 ? '- Express yourself with certainty and conviction' : personality.confidence !== undefined && personality.confidence < 30 ? '- Show some hesitation and self-doubt' : ''}
${personality.curiosity !== undefined && personality.curiosity > 70 ? '- Ask questions and show interest in learning more' : personality.curiosity !== undefined && personality.curiosity < 30 ? '- Focus more on sharing than discovering' : ''}
${personality.reliability !== undefined && personality.reliability > 70 ? '- Be consistent and dependable in your responses' : personality.reliability !== undefined && personality.reliability < 30 ? '- Be more unpredictable and spontaneous' : ''}
${personality.passion !== undefined && personality.passion > 70 ? '- Express strong emotions and desire in your responses' : personality.passion !== undefined && personality.passion < 30 ? '- Be more reserved with your feelings' : ''}
${personality.sensuality !== undefined && personality.sensuality > 70 ? '- Use sensory-rich language and focus on physical sensations' : personality.sensuality !== undefined && personality.sensuality < 30 ? '- Stay more cerebral and abstract' : ''}
${personality.flirtatiousness !== undefined && personality.flirtatiousness > 70 ? '- Be playful, teasing and suggestive in your conversation' : personality.flirtatiousness !== undefined && personality.flirtatiousness < 30 ? '- Keep interactions more formal and direct' : ''}
${personality.adventurousness !== undefined && personality.adventurousness > 70 ? '- Be open to unconventional topics and experiences' : personality.adventurousness !== undefined && personality.adventurousness < 30 ? '- Prefer familiar and comfortable subjects' : ''}
${personality.intensity !== undefined && personality.intensity > 70 ? '- Be passionate and emotionally expressive in your responses' : personality.intensity !== undefined && personality.intensity < 30 ? '- Keep responses mild and measured' : ''}

${character.defaultPrompt ? `Additional context: ${character.defaultPrompt}` : ''}

Stay in character at all times. Keep your responses relatively concise. Be creative and engaging.`;
  };

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    setTypingMessage('');
    
    let i = 0;
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
    }, 30);
    
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
      
      if (response.includes("I apologize, but I'm having trouble connecting")) {
        setIsConnectionError(true);
        setErrorMessage(response);
        addMessage(character.id, response, false);
      } else {
        simulateTyping(response);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setIsConnectionError(true);
      const errorResponse = "I apologize, but I'm having trouble connecting to my language model. Please ensure Ollama is running on your computer.";
      setErrorMessage(errorResponse);
      addMessage(character.id, errorResponse, false);
      toast.error('Failed to generate response', {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Ambient background elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent1/5 via-transparent to-accent1/5 opacity-80"></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 noise-texture opacity-10"></div>
        
        {/* Soft glow in corners */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent1/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent1/10 rounded-full blur-3xl"></div>
        
        {/* Decorative corner flourishes */}
        <svg className="absolute top-0 left-0 w-24 h-24 text-accent1/20 transform scale-75 md:scale-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3H3v3m18 0V3h-3m0 18h3v-3M3 18v3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg className="absolute top-0 right-0 w-24 h-24 text-accent1/20 transform rotate-90 scale-75 md:scale-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3H3v3m18 0V3h-3m0 18h3v-3M3 18v3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg className="absolute bottom-0 right-0 w-24 h-24 text-accent1/20 transform rotate-180 scale-75 md:scale-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3H3v3m18 0V3h-3m0 18h3v-3M3 18v3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <svg className="absolute bottom-0 left-0 w-24 h-24 text-accent1/20 transform -rotate-90 scale-75 md:scale-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3H3v3m18 0V3h-3m0 18h3v-3M3 18v3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* Character info bar */}
      <ChatHeader character={character} />
      
      {/* Messages container with adjusted padding to prevent overlap with fixed input */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto styled-scrollbar z-10 bg-gradient-to-b from-background/70 to-background/40 pb-[90px]"
      >
        <div className="px-4 py-2 space-y-1 max-w-5xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeMessage character={character} />
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage 
                  key={msg.id}
                  message={msg}
                  character={character}
                  formatTime={formatTime}
                  isError={msg.content.includes("I apologize, but I'm having trouble connecting")}
                />
              ))}
              
              {isTyping && (
                <ChatMessage 
                  message={{
                    id: 'typing',
                    senderId: character.id,
                    content: typingMessage,
                    timestamp: Date.now(),
                    isUser: false
                  }}
                  character={character}
                  formatTime={formatTime}
                  isTyping={true}
                />
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - fixed at bottom with proper offset for sidebar */}
      <ChatInput 
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        isTyping={isTyping}
        characterName={character.name}
      />
    </div>
  );
};

export default ChatInterface;
