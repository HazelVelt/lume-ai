
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateMessageProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  clearTagsButton?: boolean;
  onClearTags?: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  clearTagsButton = false,
  onClearTags
}) => {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="glass-morphism p-8 rounded-xl text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground mb-6">
          {description}
        </p>
        <div className="flex gap-2 justify-center">
          {clearTagsButton && onClearTags && (
            <Button 
              onClick={onClearTags}
              className="bg-accent1/20 hover:bg-accent1/40 text-foreground px-4 py-2 rounded-md"
            >
              Clear Tags
            </Button>
          )}
          <Button 
            onClick={onButtonClick}
            className="bg-accent1 hover:bg-accent1/80 text-white px-4 py-2 rounded-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateMessage;
