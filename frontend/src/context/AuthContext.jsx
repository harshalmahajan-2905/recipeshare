import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const login = async (email, password) => {
    const data = await api('/api/auth/login', { method:'POST', body:{ email, password } });
    setToken(data.token); setUser(data.user);
    localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
  };

  const signup = async (name, email, password) => {
    const data = await api('/api/auth/signup', { method:'POST', body:{ name, email, password } });
    setToken(data.token); setUser(data.user);
    localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => { setToken(null); setUser(null); localStorage.clear(); };

  return <AuthContext.Provider value={{ token, user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
