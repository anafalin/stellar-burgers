import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, Location } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import MainPage from '../pages/main/MainPage';
import IngredientPage from '../pages/ingredient/IngredientPage';

import { ProvideAuth } from '../utils/auth';
import {
  ProtectedRoute,
  PublicRoute,
  ResetPasswordRoute,
} from '../components/protected-route/ProtectedRoute';
import Layout from '../components/layout/layout';
import IngredientModal from '../components/ingredient-modal/IngredientModal';
import { fetchIngredients } from '../services/ingredients/actions';

// 1. Описываем интерфейс стейта локации, где может лежать background локация
interface ILocationState {
  background?: Location;
}

// Заглушка для useDispatch (если у вас настроен AppDispatch, замените тип)
type AppDispatch = any;

function AppContent(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // 2. Явно приводим тип стейта локации
  const location = useLocation();
  const state = location.state as ILocationState | null;
  const background = state?.background;

  return (
    <>
      {/* Если есть фоновый маршрут, фиксируем роутер на нем */}
      <Routes location={background || location}>
        <Route path="/" element={<Layout />}>
          {/* Публичные маршруты */}
          <Route index element={<MainPage />} />

          {/* Маршруты для НЕ авторизованных */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <ResetPasswordRoute>
                <ResetPasswordPage />
              </ResetPasswordRoute>
            }
          />

          {/* Защищенные маршруты (только для авторизованных) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Страница ингредиента (отдельная страница) */}
          <Route path="/ingredients/:id" element={<IngredientPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Модальное окно с деталями ингредиента поверх фонового маршрута */}
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
        </Routes>
      )}
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ProvideAuth>
  );
}

export default App;
