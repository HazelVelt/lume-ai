
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Character } from '@/types';
import { MessageSquare } from 'lucide-react';

interface WelcomeMessageProps {
  character: Character;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ character }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="mb-6 p-4 rounded-full relative avatar-container border-2 border-accent1/40 shadow-lg">
        <img 
          src={character.imageUrl || '/character-placeholder.jpg'} 
          alt={character.name} 
          className="h-24 w-24 rounded-full object-cover"
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
      
      <h3 className="text-2xl font-semibold text-gradient mb-2">{character.name}</h3>
      <p className="text-muted-foreground max-w-md mb-4 leading-relaxed">
        {character.description}
      </p>
      
      {character.tags && character.tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-6 max-w-md">
          {character.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="bg-accent1/10 border border-accent1/20 rounded-lg px-6 py-4 max-w-md shadow-inner flex items-center">
        <MessageSquare className="h-5 w-5 text-accent1 mr-3 flex-shrink-0" />
        <p className="text-sm text-foreground/80">
          Send a message to start chatting with {character.name}
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
