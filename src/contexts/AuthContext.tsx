import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    console.log('AuthContext: Checking for existing user');
    const token = localStorage.getItem('authToken');
    console.log('AuthContext: Token found:', !!token);
    
    if (token) {
      // You could verify the token here if needed
      // For now, we'll just check if it exists
      const userData = localStorage.getItem('userData');
      console.log('AuthContext: User data found:', !!userData);
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('AuthContext: Setting user:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('userData');
          localStorage.removeItem('authToken');
        }
      }
    }
    console.log('AuthContext: Setting loading to false');
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      const { user: userData, token } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${userData.role}`,
      });
      
      // Redirect based on role
      if (userData.role === 'student') {
        navigate('/student');
      } else if (userData.role === 'teacher') {
        navigate('/teacher');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: 'student' | 'teacher') => {
    try {
      setIsLoading(true);
      const response = await authAPI.signup({ email, password, role });
      const { user: userData, token } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Account created!",
        description: `Welcome to Smart Data Collection System as a ${role}`,
      });
      
      // Redirect based on role
      if (userData.role === 'student') {
        navigate('/student');
      } else if (userData.role === 'teacher') {
        navigate('/teacher');
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.response?.data?.message || "Error creating account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
