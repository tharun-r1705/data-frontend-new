import React from 'react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { Hero } from '@/components/Hero';
import { RoleSelection } from '@/components/RoleSelection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* Role Selection Section */}
        <RoleSelection />
      </main>
      
      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 border-t border-border/50 py-8 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">
            © 2024 Smart Data Collection System. Powered by AI and built for the future.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
