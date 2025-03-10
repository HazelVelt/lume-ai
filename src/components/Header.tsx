
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft, MessageSquare } from 'lucide-react';
import { Character } from '@/types';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  activeCharacter: Character | null;
  onReturnHome: () => void;
  onSettingsOpen?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeCharacter, onReturnHome, onSettingsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isChatPage = location.pathname.includes('/chat');
  const isLandingPage = location.pathname === '/';
  
  return (
    <div className="p-4 border-b flex items-center justify-between sticky top-0 z-20 bg-background/90 backdrop-blur-sm">
      <div className="flex items-center">
        {isLandingPage ? (
          onSettingsOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettingsOpen}
              className="mr-2 h-9 w-9 rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReturnHome}
            className="mr-2 h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
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
