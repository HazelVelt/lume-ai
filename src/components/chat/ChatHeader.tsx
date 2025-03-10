
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Character } from '@/types';
import { Heart } from 'lucide-react';
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
    <div className="p-3 bg-background/40 backdrop-blur-sm border-b flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative mr-3">
          <img 
            src={(!imgError && character.imageUrl) || '/character-placeholder.jpg'} 
            alt={character.name} 
            className="h-12 w-12 rounded-full object-cover border-2 border-accent1/30 shadow-md"
            onError={() => setImgError(true)}
          />
          <button
            onClick={handleFavoriteToggle}
            className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border hover:bg-accent1/10 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} 
            />
          </button>
        </div>
        <div>
          <h3 className="font-medium text-md wavy-decoration">{character.name}</h3>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {character.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs py-0 px-2">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
