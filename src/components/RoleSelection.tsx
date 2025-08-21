import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RoleCard } from '@/components/RoleCard';
import { GraduationCap, UserCheck, Users, BookOpen } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    navigate('/auth');
  };

  const handleTeacherClick = () => {
    navigate('/auth');
  };

  return (
    <section id="role-selection" className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent mb-6"
          >
            <Users size={16} />
            <span className="text-sm font-medium">Choose Your Role</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Get Started</span> with Your Role
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Select your role to access personalized features designed specifically for your needs. 
            Students manage their profiles, while teachers analyze and track student data with AI assistance.
          </p>
        </motion.div>
        
        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Student Card */}
          <RoleCard
            title="Student"
            description="Manage your personal profile, update academic information, and track your progress. Keep your data accurate and up-to-date with our intuitive interface."
            icon={GraduationCap}
            gradient="bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20"
            onClick={handleStudentClick}
            index={0}
          />
          
          {/* Teacher Card */}
          <RoleCard
            title="Teacher"
            description="Access comprehensive student analytics, query data with AI assistance, and flag important information. Export detailed reports and manage student records efficiently."
            icon={UserCheck}
            gradient="bg-gradient-to-br from-neon-purple/20 to-neon-pink/20"
            onClick={handleTeacherClick}
            index={1}
          />
        </div>
        
        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          
          {/* Feature 1 */}
          <div className="text-center group">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Real-time Updates</h3>
            <p className="text-muted-foreground text-sm">
              Instant synchronization across all platforms with live data updates
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="text-center group">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Role-based Access</h3>
            <p className="text-muted-foreground text-sm">
              Customized dashboards and features tailored to your specific role
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="text-center group">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <UserCheck className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">AI Assistance</h3>
            <p className="text-muted-foreground text-sm">
              Smart analytics and intelligent data management with AI insights
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-8 w-2 h-2 bg-primary rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-8 w-3 h-3 bg-accent rounded-full animate-pulse delay-1000" />
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-neon-cyan rounded-full animate-pulse delay-2000" />
    </section>
  );
};