import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

// Описываем интерфейс пропсов для роутов
interface RouteProps {
  children: React.ReactNode;
}

// Типизируем стейт локации для передачи предыдущего маршрута
interface LocationState {
  from: ReturnType<typeof useLocation>;
}

// Для защищенных маршрутов (только для авторизованных)
export const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Передаем текущую локацию в state для последующего редиректа после логина
    return <Navigate to="/login" state={{ from: location } as LocationState} replace />;
  }

  return <>{children}</>;
};

// Для маршрутов, куда нельзя заходить авторизованным (login, register)
export const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Специальная защита для /reset-password
export const ResetPasswordRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, isForgotPasswordVisited } = useAuth();
  const location = useLocation();

  // Если пользователь авторизован - на главную
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Если не посещали forgot-password - на forgot-password
  if (!isForgotPasswordVisited) {
    return <Navigate to="/forgot-password" state={{ from: location } as LocationState} replace />;
  }

  return <>{children}</>;
};
