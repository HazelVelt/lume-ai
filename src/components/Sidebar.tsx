
import React from 'react';
import { Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useCharacter } from '@/contexts/CharacterContext';
import CharacterCard from '@/components/CharacterCard';

interface SidebarProps {
  onCreateCharacter: () => void;
  onEditCharacter: (id: string) => void;
  onSettingsOpen: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onCreateCharacter,
  onEditCharacter,
  onSettingsOpen,
  isSidebarCollapsed,
  toggleSidebar,
}) => {
  const { characters, setActiveCharacter, deleteCharacter, activeCharacter } = useCharacter();
  const [cardScale, setCardScale] = React.useState(50); // Scale from 0-100
  
  // Calculate if cards should be compact based on scale
  const isCompact = cardScale < 40;

  return (
    <div className={`${isSidebarCollapsed ? 'w-0 md:w-16 overflow-hidden' : 'w-full md:w-[320px]'} border-r border-border bg-background/95 backdrop-blur-sm flex flex-col h-full transition-all duration-300 relative z-30`}>
      <div className="p-4 border-b flex justify-between items-center">
        {!isSidebarCollapsed && (
          <h1 className="text-xl font-bold text-gradient cursor-pointer">
            AI Haven
          </h1>
        )}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsOpen}
            className="h-8 w-8 rounded-full"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isSidebarCollapsed && (
        <>
          <div className="flex justify-between items-center p-4">
            <h2 className="text-sm font-semibold text-foreground/70">Your Characters</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={onCreateCharacter}
              className="flex items-center text-xs h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New
            </Button>
          </div>

          {/* Card Scale Slider */}
          <div className="px-4 pb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Card Size</span>
              <span className="text-xs text-muted-foreground">{isCompact ? 'Compact' : 'Normal'}</span>
            </div>
            <Slider 
              value={[cardScale]} 
              onValueChange={(value) => setCardScale(value[0])}
              min={20}
              max={80}
              step={1}
              className="my-2"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 scrollbar-none">
            {characters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="glass-morphism p-6 rounded-lg max-w-[240px]">
                  <h3 className="text-lg font-semibold mb-2">No Characters Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first AI character to start chatting
                  </p>
                  <Button 
                    onClick={onCreateCharacter}
                    className="w-full bg-accent1 hover:bg-accent1/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Character
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {characters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onSelect={setActiveCharacter}
                    onEdit={onEditCharacter}
                    onDelete={deleteCharacter}
                    isActive={activeCharacter?.id === character.id}
                    showPersonalityValues={false}
                    compact={isCompact}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Sidebar toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-4 h-8 w-8 rounded-full bg-background border border-border shadow-md z-40"
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default Sidebar;
