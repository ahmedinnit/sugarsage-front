// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Attempt to fetch stored user info from localStorage
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('userRole'); // Ensure you store role in localStorage during login
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem('jwt', token);
    localStorage.setItem('userRole', role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
