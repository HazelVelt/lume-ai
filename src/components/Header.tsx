
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { Character } from '@/types';
import { Link } from 'react-router-dom';

interface HeaderProps {
  activeCharacter: Character | null;
  onReturnHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeCharacter, onReturnHome }) => {
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
        <h1 className="text-xl font-bold text-gradient">
          AI Haven
        </h1>
      </div>
      <div className="flex items-center">
        {activeCharacter && (
          <span className="text-sm text-muted-foreground">
            Chatting with {activeCharacter.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;
