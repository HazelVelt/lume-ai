
import React from 'react';
import { Slider } from './ui/slider';

export interface PersonalitySliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
}

const PersonalitySlider: React.FC<PersonalitySliderProps> = ({
  label,
  description,
  value,
  onChange,
  icon
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {icon && <div className="text-accent1">{icon}</div>}
          <label className="text-sm font-medium">{label}</label>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0}
        max={100}
        step={5}
      />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default PersonalitySlider;
