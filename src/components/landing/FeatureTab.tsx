
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

interface FeatureItem {
  icon: LucideIcon;
  text: string;
}

interface FeatureTabProps {
  value: string;
  title: string;
  features: FeatureItem[];
  visual: React.ReactNode;
}

const FeatureTab: React.FC<FeatureTabProps> = ({ value, title, features, visual }) => {
  return (
    <TabsContent value={value} className="glass-morphism p-6 rounded-lg">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">{title}</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-accent1/20 p-1 rounded-full mr-3 mt-1">
                  <feature.icon className="h-4 w-4 text-accent1" />
                </div>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {visual}
        </div>
      </div>
    </TabsContent>
  );
};

export default FeatureTab;
