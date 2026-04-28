import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password?: string
  ) => Promise<User>;
  updateProfile: (data: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('2hand_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@2hand.vn';

  useEffect(() => {
    api.get<User>('/auth/me').then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('2hand_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('2hand_user');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    const loggedInUser = await api.post<User>('/auth/login', {
      email,
      password
    });
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password?: string
  ) => {
    const newUser = await api.post<User>('/auth/register', {
      name,
      email,
      phone,
      password
    });
    setUser(newUser);
    return newUser;
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await api.put<User>('/users/me', data);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isAdmin,
        login,
        logout,
        register,
        updateProfile
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
