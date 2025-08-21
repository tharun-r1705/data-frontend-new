import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hover = false,
  glow = false,
  animated = true,
  onClick,
  ...props 
}) => {
  const baseClassName = cn(
    "glass-card rounded-xl p-6 relative overflow-hidden",
    hover && "cursor-pointer transition-all duration-300 hover:border-primary/50",
    glow && "shadow-glow-primary",
    className
  );

  if (animated) {
    return (
      <motion.div
        className={baseClassName}
        whileHover={hover ? { 
          scale: 1.02, 
          y: -5,
          transition: { duration: 0.2 }
        } : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClick}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Animated border glow effect */}
        {hover && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </motion.div>
    );
  }

  return (
    <div className={baseClassName} onClick={onClick}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border glow effect */}
      {hover && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
};