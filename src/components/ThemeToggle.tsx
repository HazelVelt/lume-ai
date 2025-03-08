
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button 
      variant="outline" 
      size="default" 
      onClick={toggleTheme}
      className="flex items-center gap-2"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
