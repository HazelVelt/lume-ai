
import React, { useState, useMemo } from 'react';
import { Settings, Plus, ChevronLeft, ChevronRight, Heart, Tags, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCharacter } from '@/contexts/CharacterContext';
import CharacterCard from '@/components/CharacterCard';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  onCreateCharacter: () => void;
  onEditCharacter: (id: string) => void;
  onSettingsOpen: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  onReturnHome: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onCreateCharacter,
  onEditCharacter,
  onSettingsOpen,
  isSidebarCollapsed,
  toggleSidebar,
  selectedTags,
  toggleTag,
  onReturnHome,
}) => {
  const { characters, setActiveCharacter, deleteCharacter, activeCharacter, toggleFavorite, cardSize } = useCharacter();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  const isCompact = cardSize < 40;
  
  const getCardSizeClass = () => {
    if (cardSize < 20) return 'super-compact';
    if (cardSize < 35) return 'compact';
    if (cardSize < 50) return 'normal';
    if (cardSize < 70) return 'large';
    if (cardSize < 85) return 'extra-large';
    return 'massive';
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    characters.forEach(char => {
      if (char.tags && char.tags.length > 0) {
        char.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [characters]);

  const { favoriteCharacters, otherCharacters } = useMemo(() => {
    const favorites = characters.filter(c => c.isFavorite);
    const others = characters.filter(c => !c.isFavorite);
    
    return {
      favoriteCharacters: favorites,
      otherCharacters: others
    };
  }, [characters]);
  
  const displayCharacters = useMemo(() => {
    let filtered = showOnlyFavorites 
      ? favoriteCharacters 
      : [...favoriteCharacters, ...otherCharacters];
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(char => {
        if (!char.tags || char.tags.length === 0) return false;
        return selectedTags.every(tag => char.tags?.includes(tag));
      });
    }
    
    return filtered;
  }, [favoriteCharacters, otherCharacters, showOnlyFavorites, selectedTags]);

  return (
    <div className={`${isSidebarCollapsed ? 'w-0 md:w-16 overflow-hidden' : 'w-full md:w-[320px]'} relative border-r border-border paper-texture transition-all duration-300 z-20`}>
      {/* Handcrafted Sidebar Header */}
      <div className="p-4 border-b border-dashed border-border/70 bg-background/70 backdrop-blur-sm flex items-center">
        {!isLandingPage && !isSidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReturnHome}
            className="mr-2 h-8 w-8 rounded-full hover:bg-secondary/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        {!isSidebarCollapsed && (
          <h1 className="text-xl font-bold sketch-underline">
            LumeAI
          </h1>
        )}
        
        <div className="ml-auto flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsOpen}
            className="h-8 w-8 rounded-full hover:bg-secondary/50"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isSidebarCollapsed && (
        <>
          <div className="flex justify-between items-center p-4 bg-background/40">
            <h2 className="text-sm font-semibold wavy-decoration">Your Characters</h2>
            <Button 
              variant="ghost"
              size="sm"
              onClick={onCreateCharacter}
              className="hand-drawn-button shadow-foreground/20 hover:bg-background/70 text-xs h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New
            </Button>
          </div>

          {allTags.length > 0 && (
            <div className="px-4 pb-2 bg-secondary/10">
              <div className="flex items-center mb-2">
                <Tags className="h-4 w-4 mr-2 text-muted-foreground" />
                <h3 className="text-xs font-medium text-muted-foreground">Filter by Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {allTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105 rounded-md"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="px-4 py-2 space-y-2 bg-background/60">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`text-xs h-7 flex items-center gap-1 rounded-full ${showOnlyFavorites ? 'bg-accent1/20' : ''}`}
              >
                <Heart className={`h-3 w-3 ${showOnlyFavorites ? 'text-red-500 fill-red-500' : ''}`} />
                {showOnlyFavorites ? 'Showing favorites' : 'Show all'}
              </Button>
              {favoriteCharacters.length > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({favoriteCharacters.length} favorite{favoriteCharacters.length > 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 scrollbar-none bg-gradient-to-b from-background/40 to-background/20">
            {characters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="glass-morphism p-6 rounded-lg max-w-[240px] shadow-md transform rotate-1">
                  <h3 className="text-lg font-semibold mb-2 sketch-underline">No Characters Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first AI character to start chatting
                  </p>
                  <Button 
                    onClick={onCreateCharacter}
                    className="hand-drawn-button shadow-foreground/20 w-full bg-accent1 hover:bg-accent1/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Character
                  </Button>
                </div>
              </div>
            ) : displayCharacters.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground">
                  {selectedTags.length > 0 
                    ? 'No characters match the selected tags.' 
                    : 'No favorites yet. Add characters to favorites to see them here.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {displayCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onSelect={setActiveCharacter}
                    onEdit={onEditCharacter}
                    onDelete={deleteCharacter}
                    onToggleFavorite={toggleFavorite}
                    isActive={activeCharacter?.id === character.id}
                    showPersonalityValues={false}
                    compact={isCompact}
                    sizeClass={getCardSizeClass()}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Fixed z-index issue with the toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-4 h-8 w-8 rounded-full bg-background border border-border shadow-md z-50"
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
