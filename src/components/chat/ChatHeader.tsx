
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Character } from '@/types';
import { Heart, Sparkles, Zap } from 'lucide-react';
import { useCharacter } from '@/contexts/CharacterContext';

interface ChatHeaderProps {
  character: Character;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ character }) => {
  const { toggleFavorite, characters } = useCharacter();
  const [imgError, setImgError] = useState(false);
  
  // Find the current character in the global state to get the up-to-date favorite status
  const currentCharacter = characters.find(c => c.id === character.id);
  const isFavorite = currentCharacter?.isFavorite || false;
  
  const handleFavoriteToggle = () => {
    toggleFavorite(character.id);
  };

  return (
    <div className="p-3 glass-morphism border-b border-accent1/20 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center">
        <div className="relative mr-3">
          <div className="absolute inset-0 bg-gradient-to-br from-accent1/30 to-transparent rounded-full opacity-50 blur-sm animate-pulse-soft"></div>
          <img 
            src={(!imgError && character.imageUrl) || '/character-placeholder.jpg'} 
            alt={character.name} 
            className="h-12 w-12 rounded-full object-cover border-2 border-accent1/30 shadow-lg relative z-10"
            onError={() => setImgError(true)}
          />
          <button
            onClick={handleFavoriteToggle}
            className="absolute -bottom-1 -right-1 bg-background/80 backdrop-blur-sm rounded-full p-1.5 border border-border/80 
                     hover:bg-accent1/10 transition-colors duration-300 shadow-md z-20 group transform hover:scale-110"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-3.5 w-3.5 ${isFavorite 
                ? 'text-red-500 fill-red-500' 
                : 'text-muted-foreground group-hover:text-red-500'}`} 
            />
            
            {/* Radial pulse effect on hover */}
            <span className="absolute inset-0 rounded-full bg-red-500/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
          </button>
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-md mr-2 brush-stroke">{character.name}</h3>
            <Sparkles className="h-3.5 w-3.5 text-accent1/80 animate-pulse-soft" />
          </div>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {character.tags?.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs py-0 px-2 bg-background/50 border-accent1/30 backdrop-blur-sm"
              >
                <Zap className="h-2.5 w-2.5 mr-1 text-accent1/70" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Character personality indicators */}
      <div className="hidden md:flex space-x-1.5">
        {character.personality.dominance > 70 && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs">
            Dominant
          </Badge>
        )}
        {character.personality.creativity > 70 && (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs">
            Creative
          </Badge>
        )}
        {character.personality.humor > 70 && (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
            Humorous
          </Badge>
        )}
        {character.personality.intelligence > 70 && (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-xs">
            Intelligent
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
