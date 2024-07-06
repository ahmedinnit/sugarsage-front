import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (isAuth && role === 'admin') {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

const UserRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (isAuth && role === 'user') {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

const AuthRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (isAuth && role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  } else if (isAuth && role === 'user') {
    return <Navigate to="/user/dashboard" />;
  } else {
    return children;
  }
};

export { AdminRoute, UserRoute, AuthRoute };
