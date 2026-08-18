import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

// Для защищенных маршрутов (только для авторизованных)
export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Для маршрутов, куда нельзя заходить авторизованным (login, register)
export function PublicRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Специальная защита для /reset-password
export function ResetPasswordRoute({ children }) {
  const { user, isForgotPasswordVisited } = useAuth();
  const location = useLocation();

  // Если пользователь авторизован - на главную
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Если не посещали forgot-password - на forgot-password
  if (!isForgotPasswordVisited) {
    return <Navigate to="/forgot-password" state={{ from: location }} replace />;
  }

  return children;
}
