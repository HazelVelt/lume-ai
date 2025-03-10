
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Character } from '@/types';
import { MessageSquare, Sparkles, Pencil, VenetianMask, Flame, Heart, Vibrate } from 'lucide-react';

interface WelcomeMessageProps {
  character: Character;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ character }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 right-10 transform rotate-12 opacity-10">
          <Sparkles className="h-24 w-24 text-accent1" />
        </div>
        <div className="absolute bottom-10 left-10 transform -rotate-12 opacity-10">
          <Pencil className="h-24 w-24 text-accent1" />
        </div>
        
        {/* Wavy decoration lines */}
        <svg className="absolute top-1/4 left-0 w-full opacity-10" height="12" viewBox="0 0 100 12">
          <path d="M 0 6 Q 5 0, 10 6 T 20 6 T 30 6 T 40 6 T 50 6 T 60 6 T 70 6 T 80 6 T 90 6 T 100 6" 
                fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        
        <svg className="absolute bottom-1/4 left-0 w-full opacity-10" height="12" viewBox="0 0 100 12">
          <path d="M 0 6 Q 5 12, 10 6 T 20 6 T 30 6 T 40 6 T 50 6 T 60 6 T 70 6 T 80 6 T 90 6 T 100 6" 
                fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      
      {/* Character avatar with animated effects */}
      <div className="mb-8 relative group z-10">
        <div className="absolute inset-0 bg-accent1/20 blur-xl rounded-full animate-pulse-slow opacity-50"></div>
        <div className="relative handcrafted-border bg-background/30 p-1.5 rounded-full shadow-xl 
                      transform hover:rotate-3 transition-transform duration-300">
          <div className="avatar-container p-1 rounded-full border-2 border-accent1/60 overflow-hidden">
            <img 
              src={(!imgError && character.imageUrl) || '/placeholder.svg'} 
              alt={character.name} 
              className="h-28 w-28 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
          
          {/* Animated pulse rings */}
          <div className="absolute -inset-1 rounded-full border border-accent1/30 animate-ping-slow opacity-50"></div>
          <div className="absolute -inset-3 rounded-full border border-accent1/20 animate-ping-slow opacity-30 delay-300"></div>
          <div className="absolute -inset-5 rounded-full border border-accent1/10 animate-ping-slow opacity-20 delay-600"></div>
        </div>
      </div>
      
      {/* Character name with hand-drawn underline */}
      <div className="relative mb-2 z-10">
        <h2 className="text-3xl font-bold text-gradient animate-float">
          {character.name}
        </h2>
        <svg className="absolute -bottom-2 left-1/4 right-1/4 w-1/2 mx-auto opacity-70" height="6" viewBox="0 0 100 6">
          <path d="M 0 3 Q 10 6, 20 3 T 40 3 T 60 3 T 80 3 T 100 3" 
                fill="none" stroke="currentColor" strokeWidth="2" className="text-accent1" />
        </svg>
      </div>
      
      {/* Character description with handcrafted text container */}
      <div className="max-w-lg mb-6 relative z-10">
        <div className="handcrafted-card p-4 bg-gradient-to-r from-background/60 to-background/30 backdrop-blur-sm border border-accent1/20 shadow-inner">
          <p className="text-muted-foreground leading-relaxed">
            {character.description}
          </p>
        </div>
      </div>
      
      {/* Character tags */}
      {character.tags && character.tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-8 max-w-lg animate-float-slow">
          {character.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs border border-accent1/30 bg-accent1/5 px-3 py-1 rounded-full transform hover:scale-110 transition-transform duration-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Start chatting message */}
      <div className="relative z-10 transform transition-transform duration-300 hover:scale-105">
        <div className="handcrafted-callout bg-accent1/10 px-6 py-5 rounded-lg backdrop-blur-sm max-w-md flex items-center gap-3 border-2 border-dashed border-accent1/30">
          <div className="p-2 bg-accent1/20 rounded-full">
            <MessageSquare className="h-6 w-6 text-accent1" />
          </div>
          <p className="text-sm text-foreground/90 font-medium">
            Type a message below to start your conversation with {character.name}
          </p>
        </div>
        
        {/* Decorative corner dots */}
        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-accent1/40"></div>
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-accent1/40"></div>
        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-accent1/40"></div>
        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-full bg-accent1/40"></div>
      </div>
      
      <style>
        {`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .handcrafted-card {
          border-radius: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .handcrafted-callout {
          box-shadow: 0 6px 15px -3px rgba(0, 0, 0, 0.1);
        }
        `}
      </style>
    </div>
  );
};

export default WelcomeMessage;
