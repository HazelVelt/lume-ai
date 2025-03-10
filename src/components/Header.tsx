
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, Star, StarOff } from 'lucide-react';
import { Character } from '@/types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCharacter } from '@/contexts/CharacterContext';

interface HeaderProps {
  activeCharacter: Character | null;
  onReturnHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeCharacter, onReturnHome }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCharacter } = useCharacter();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (activeCharacter) {
      updateCharacter(activeCharacter.id, {
        ...activeCharacter,
        isFavorite: !activeCharacter.isFavorite
      });
    }
  };
  
  const isChatPage = location.pathname.includes('/chat');
  
  return (
    <div className="p-4 border-b flex items-center justify-between sticky top-0 z-20 bg-background/90 backdrop-blur-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReturnHome}
          className="mr-2 h-9 w-9 rounded-full"
        >
          <Home className="h-5 w-5" />
        </Button>
        {!isChatPage && (
          <h1 className="text-xl font-bold text-gradient">
            AI Haven
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        {activeCharacter && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="mr-1 h-8 w-8 rounded-full"
            >
              {activeCharacter.isFavorite ? (
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
            <span className="text-sm text-muted-foreground mr-2">
              Chatting with {activeCharacter.name}
            </span>
          </>
        )}
        {window.location.pathname !== '/chat' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/chat')}
            className="flex items-center text-sm"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat Page
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
