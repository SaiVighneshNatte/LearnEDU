import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If not authorized for this role, send to their own dashboard or login
    const redirectPath = userRole === 'ADMIN' ? '/admin' : 
                         userRole === 'INSTRUCTOR' ? '/instructor' : 
                         userRole === 'STUDENT' ? '/student' : '/login';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
