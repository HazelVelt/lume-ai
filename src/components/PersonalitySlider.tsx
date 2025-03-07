
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PersonalitySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  description?: string;
}

const PersonalitySlider: React.FC<PersonalitySliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = 'bg-accent1',
  description,
}) => {
  return (
    <div className="w-full space-y-2 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <label className="text-sm font-medium text-foreground/80">{label}</label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <span className="text-sm text-foreground/60">{value}%</span>
      </div>
      <Slider
        className="py-1"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
      />
      <div className="flex justify-between text-xs text-foreground/40">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default PersonalitySlider;
