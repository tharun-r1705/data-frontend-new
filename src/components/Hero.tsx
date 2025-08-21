import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DataSphere } from '@/components/ui/DataSphere';
import { ChevronRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-secondary" />
      
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary/20 border border-primary/30 text-primary mb-8"
            >
              <Sparkles size={16} />
              <span className="text-sm font-medium">AI-Powered Data Management</span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            >
              <span className="gradient-text">Smart Data</span>
              <br />
              <span className="text-foreground">Collection</span>
              <br />
              <span className="gradient-text">System</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl lg:max-w-none"
            >
              Collect Once. Access Anytime. 
              <br className="hidden sm:block" />
              Revolutionizing student data management with 
              <span className="text-primary font-semibold"> intelligence and automation</span>.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                variant="hero" 
                size="lg"
                className="group"
                onClick={() => document.getElementById('role-selection')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="glass" 
                size="lg"
              >
                Learn More
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border/50"
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">24/7</div>
                <div className="text-sm text-muted-foreground">Availability</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">AI</div>
                <div className="text-sm text-muted-foreground">Powered</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Content - 3D Data Sphere */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -30 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow Effect Behind Sphere */}
              <div className="absolute inset-0 bg-gradient-primary/30 blur-3xl scale-150 animate-pulse" />
              
              {/* 3D Data Sphere */}
              <DataSphere className="relative z-10" size={400} />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 px-3 py-1 bg-success/20 border border-success/40 rounded-full text-xs text-success font-medium"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Real-time Sync
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -right-4 px-3 py-1 bg-info/20 border border-info/40 rounded-full text-xs text-info font-medium"
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                AI Analysis
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};