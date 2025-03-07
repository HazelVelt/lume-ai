
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
}

const PersonalitySlider: React.FC<PersonalitySliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = 'bg-accent1',
}) => {
  return (
    <div className="w-full space-y-2 animate-fade-in">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <span className="text-sm text-white/60">{value}%</span>
      </div>
      <Slider
        className="py-1"
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        trackClassName={cn('h-2', color)}
      />
      <div className="flex justify-between text-xs text-white/40">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default PersonalitySlider;
