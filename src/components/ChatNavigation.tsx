
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Character } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ChatNavigationProps {
  character: Character;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ChatNavigation: React.FC<ChatNavigationProps> = ({
  character,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="w-full grid grid-cols-2 gap-1">
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-14 rounded-lg"
          onClick={() => onEdit(character.id)}
        >
          <Pencil className="h-5 w-5 mb-1" />
          <span className="text-xs">Edit</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-14 rounded-lg text-destructive"
            >
              <Trash2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Delete Character</AlertDialogTitle>
              <AlertDialogDescription className="text-destructive/80">
                Are you sure you want to delete <span className="font-semibold">{character.name}</span>?
                This action cannot be undone and all chat history will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(character.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ChatNavigation;
