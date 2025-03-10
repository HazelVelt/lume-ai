
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface TagFilterBarProps {
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({ allTags, selectedTags, toggleTag }) => {
  if (allTags.length === 0) return null;
  
  return (
    <div className="px-4 py-2 border-b flex items-center overflow-x-auto scrollbar-none bg-background/70 backdrop-blur-sm">
      <BookOpen className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
      <div className="flex gap-2 flex-wrap">
        {allTags.map(tag => (
          <Badge 
            key={tag} 
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagFilterBar;
