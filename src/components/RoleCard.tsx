import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
  index: number;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  onClick,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlassCard 
        hover 
        className="h-full cursor-pointer group"
        onClick={onClick}
      >
        {/* Background gradient */}
        <div 
          className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-xl ${gradient}`}
        />
        
        {/* Icon with glow effect */}
        <div className="relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-gradient-primary/20 group-hover:bg-gradient-primary/30 transition-all duration-300">
              <Icon size={48} className="text-primary group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          
          {/* Title with gradient text */}
          <h3 className="text-2xl font-bold mb-3 gradient-text group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            {description}
          </p>
          
          {/* Action button */}
          <Button 
            variant="neon" 
            size="lg"
            className="w-full group-hover:shadow-glow-primary"
          >
            Get Started
          </Button>
        </div>
        
        {/* Animated particles overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};