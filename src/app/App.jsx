import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import { ProvideAuth } from '../utils/auth';
import MainPage from '../pages/main/MainPage';
import {
  ProtectedRoute,
  PublicRoute,
  ResetPasswordRoute,
} from '../components/protected-route/ProtectedRoute';
import Layout from '../components/layout/layout';
import IngredientModal from '../components/ingredient-modal/IngredientModal';
import IngredientPage from '../pages/ingredient/IngredientPage';
import { fetchIngredients } from '../services/ingredients/actions';
import { useDispatch } from 'react-redux';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const location = useLocation();
  const state = location.state;
  const background = state && state.background;

  return (
    <>
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

      {/* Модальное окно с деталями ингредиента */}
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={<IngredientModal />}
          />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ProvideAuth>
  );
}

export default App;
