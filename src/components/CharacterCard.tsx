
import React, { useState } from 'react';
import { Character } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, MessageCircle, Trash2, AlertTriangle } from 'lucide-react';
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

interface CharacterCardProps {
  character: Character;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isActive?: boolean;
  showPersonalityValues?: boolean;
  compact?: boolean;
  sizeClass?: 'super-compact' | 'compact' | 'normal' | 'large' | 'extra-large';
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onEdit,
  onDelete,
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
  };

  // Define styles based on size class
  const getStyles = () => {
    switch (sizeClass) {
      case 'super-compact':
        return {
          imageHeight: 'h-16',
          contentPadding: 'p-1.5',
          buttonHeight: 'h-5',
          buttonTextSize: 'text-[9px]',
          iconSize: 'h-2 w-2',
          nameSize: 'text-xs',
          descriptionHeight: 'h-4',
          descriptionTextSize: 'text-[8px]',
          showTags: false
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
          showTags: true
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
          showTags: true
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
          showTags: true
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
          showTags: true
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
          showTags: true
        };
    }
  };

  const style = getStyles();

  return (
    <>
      <Card 
        className={`w-full overflow-hidden transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg ${
          isActive ? 'ring-2 ring-accent1' : ''
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
          
          <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
            <h3 className={`${style.nameSize} font-semibold text-foreground truncate`}>{character.name}</h3>
          </div>
        </div>
        
        <CardContent className={`${style.contentPadding} space-y-1`}>
          <p className={`${style.descriptionTextSize} text-muted-foreground line-clamp-2 ${style.descriptionHeight}`}>
            {character.description}
          </p>
          
          {/* Tags */}
          {style.showTags && character.tags && character.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 my-1">
              {character.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className={`${style.buttonTextSize} py-0`}>
                  {tag}
                </Badge>
              ))}
              {character.tags.length > 3 && (
                <Badge variant="outline" className={`${style.buttonTextSize} py-0`}>
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
          
          {sizeClass !== 'super-compact' && sizeClass !== 'compact' && (
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Delete Character
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{character.name}</span>?
              This action cannot be undone and all chat history with this character will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CharacterCard;
