import React, { useState } from 'react';
import { Character } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, MessageCircle, Trash2, AlertTriangle, Heart } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface CharacterCardProps {
  character: Character;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isActive?: boolean;
  showPersonalityValues?: boolean;
  compact?: boolean;
  sizeClass?: 'super-compact' | 'compact' | 'normal' | 'large' | 'extra-large' | 'massive';
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
  isActive = false,
  showPersonalityValues = true,
  compact = false,
  sizeClass = 'normal',
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(character.id);
    setDeleteDialogOpen(false);
    toast.error(`Deleted ${character.name}`, { duration: 1000 });
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(character.id);
      toast.success(`${character.isFavorite ? 'Removed from' : 'Added to'} favorites`, { duration: 1000 });
    }
  };

  const getStyles = () => {
    switch (sizeClass) {
      case 'super-compact':
        return {
          imageHeight: 'h-14',
          contentPadding: 'p-1.5',
          buttonHeight: 'h-5',
          buttonTextSize: 'text-[9px]',
          iconSize: 'h-2 w-2',
          nameSize: 'text-xs',
          descriptionHeight: 'h-0',
          descriptionTextSize: 'text-[8px]',
          showTags: false,
          showButtons: false
        };
      case 'compact':
        return {
          imageHeight: 'h-20',
          contentPadding: 'p-2',
          buttonHeight: 'h-6',
          buttonTextSize: 'text-[10px]',
          iconSize: 'h-2.5 w-2.5',
          nameSize: 'text-sm',
          descriptionHeight: 'h-6',
          descriptionTextSize: 'text-[10px]',
          showTags: true,
          showButtons: true
        };
      case 'normal':
        return {
          imageHeight: 'h-32',
          contentPadding: 'p-3',
          buttonHeight: 'h-7',
          buttonTextSize: 'text-xs',
          iconSize: 'h-3 w-3',
          nameSize: 'text-base',
          descriptionHeight: 'h-8',
          descriptionTextSize: 'text-xs',
          showTags: true,
          showButtons: true
        };
      case 'large':
        return {
          imageHeight: 'h-40',
          contentPadding: 'p-4',
          buttonHeight: 'h-8',
          buttonTextSize: 'text-sm',
          iconSize: 'h-4 w-4',
          nameSize: 'text-lg',
          descriptionHeight: 'h-12',
          descriptionTextSize: 'text-sm',
          showTags: true,
          showButtons: true
        };
      case 'extra-large':
        return {
          imageHeight: 'h-48',
          contentPadding: 'p-4',
          buttonHeight: 'h-9',
          buttonTextSize: 'text-base',
          iconSize: 'h-5 w-5',
          nameSize: 'text-xl',
          descriptionHeight: 'h-16',
          descriptionTextSize: 'text-base',
          showTags: true,
          showButtons: true
        };
      case 'massive':
        return {
          imageHeight: 'h-56',
          contentPadding: 'p-5',
          buttonHeight: 'h-10',
          buttonTextSize: 'text-lg',
          iconSize: 'h-6 w-6',
          nameSize: 'text-2xl',
          descriptionHeight: 'h-20',
          descriptionTextSize: 'text-lg',
          showTags: true,
          showButtons: true
        };
      default:
        return {
          imageHeight: 'h-32',
          contentPadding: 'p-3',
          buttonHeight: 'h-7',
          buttonTextSize: 'text-xs',
          iconSize: 'h-3 w-3',
          nameSize: 'text-base',
          descriptionHeight: 'h-8',
          descriptionTextSize: 'text-xs',
          showTags: true,
          showButtons: true
        };
    }
  };

  const style = getStyles();

  return (
    <>
      <Card 
        className={`w-full overflow-hidden transition-all duration-300 group hover:shadow-lg bg-gradient-to-br from-background/80 to-accent/5 backdrop-blur-sm ${
          isActive ? 'ring-2 ring-accent1' : 'hover:ring-1 hover:ring-accent1/30'
        }`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
          
          <img
            src={character.imageUrl || '/character-placeholder.jpg'}
            alt={character.name}
            className={`w-full ${style.imageHeight} object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/character-placeholder.jpg';
            }}
          />
          
          {onToggleFavorite && (
            <button 
              onClick={handleToggleFavorite}
              className="absolute top-2 right-2 z-20 bg-background/30 backdrop-blur-sm p-1 rounded-full"
            >
              <Heart 
                className={`${style.iconSize} ${character.isFavorite ? 'text-red-500 fill-red-500' : 'text-white/70'}`} 
              />
            </button>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
            <h3 className={`${style.nameSize} font-semibold text-foreground truncate`}>{character.name}</h3>
          </div>
        </div>
        
        <CardContent className={`${style.contentPadding} space-y-1`}>
          {style.descriptionHeight !== 'h-0' && (
            <p className={`${style.descriptionTextSize} text-muted-foreground line-clamp-2 ${style.descriptionHeight}`}>
              {character.description}
            </p>
          )}
          
          {style.showTags && character.tags && character.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 my-1">
              {character.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className={`${style.buttonTextSize} py-0 bg-accent1/10`}>
                  {tag}
                </Badge>
              ))}
              {character.tags.length > 3 && (
                <Badge variant="outline" className={`${style.buttonTextSize} py-0 bg-accent1/5`}>
                  +{character.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {showPersonalityValues && !compact && (
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="flex flex-col">
                  <span className="text-foreground/60">Kinkiness</span>
                  <span className="font-medium">{character.personality.kinkiness}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground/60">Dominance</span>
                  <span className="font-medium">{character.personality.dominance}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-foreground/60">Submissiveness</span>
                  <span className="font-medium">{character.personality.submissiveness}%</span>
                </div>
              </div>
            </div>
          )}
          
          {style.showButtons && (
            <div className="flex justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                className={`flex-1 mr-1 transition-all hover:bg-accent1/20 ${style.buttonHeight} ${style.buttonTextSize}`}
                onClick={() => onEdit(character.id)}
              >
                <Pencil className={`${style.iconSize} mr-1`} /> Edit
              </Button>
              
              <Button
                variant="default"
                size="sm"
                className={`flex-1 ml-1 bg-accent1 hover:bg-accent1/80 ${style.buttonHeight} ${style.buttonTextSize}`}
                onClick={() => onSelect(character.id)}
              >
                <MessageCircle className={`${style.iconSize} mr-1`} /> Chat
              </Button>
            </div>
          )}
          
          {sizeClass !== 'super-compact' && sizeClass !== 'compact' && style.showButtons && (
            <Button 
              variant="ghost" 
              size="sm" 
              className={`w-full text-destructive hover:text-destructive hover:bg-destructive/10 ${style.buttonHeight} ${style.buttonTextSize} mt-1`}
              onClick={handleDelete}
            >
              <Trash2 className={`${style.iconSize} mr-1`} /> Delete
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gradient-to-br from-red-900/20 to-red-950/20 backdrop-blur-sm border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-500">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Delete Character
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-200/80">
              Are you sure you want to delete <span className="font-semibold text-white">{character.name}</span>?
              This action cannot be undone and all chat history with this character will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-red-500/30 text-white hover:bg-red-950/30">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CharacterCard;
