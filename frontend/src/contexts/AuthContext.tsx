import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/signup', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
