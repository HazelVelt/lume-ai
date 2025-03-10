
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Character } from '@/types';
import { Star } from 'lucide-react';
import { useCharacter } from '@/contexts/CharacterContext';

interface ChatHeaderProps {
  character: Character;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ character }) => {
  const { toggleFavorite } = useCharacter();

  return (
    <div className="p-3 bg-background/40 backdrop-blur-sm border-b flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative mr-3">
          <img 
            src={character.imageUrl || '/character-placeholder.jpg'} 
            alt={character.name} 
            className="h-12 w-12 rounded-full object-cover border-2 border-accent1/30 shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/character-placeholder.jpg';
            }}
          />
          <button
            onClick={() => toggleFavorite(character.id)}
            className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border hover:bg-accent1/10 transition-colors"
          >
            <Star 
              className={`h-4 w-4 ${character.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} 
            />
          </button>
        </div>
        <div>
          <h3 className="font-medium text-md">{character.name}</h3>
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
