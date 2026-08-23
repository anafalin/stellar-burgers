import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import MainPage from '../pages/main/MainPage';
import IngredientPage from '../pages/ingredient/IngredientPage';
import { ProvideAuth } from '../utils/auth';
import { ProtectedRoute, PublicRoute, ResetPasswordRoute } from '../components/protected-route/ProtectedRoute';
import Layout from '../components/layout/layout';
import IngredientModal from '../components/ingredient-modal/IngredientModal';
import { fetchIngredients } from '../services/ingredients/actions';
import { AppDispatch } from '../services';
import FeedsPage from '../pages/feeds/FeedsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ProfileInfoPage from '../pages/profile/ProfileInfoPage';
import ProfileOrdersPage from '../pages/profile/ProfileOrdersPage';

interface ILocationState {
  background?: ReturnType<typeof useLocation>;
}

function AppContent(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const location = useLocation();
  const state = location.state as ILocationState | null;
  const background = state?.background;

  return (
    <>
      {/* Главная сетка роутов */}
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

          {/* Лента заказов (Обратите внимание на относительный путь дочернего роута) */}
          <Route path="/feed" element={<FeedsPage />}>
            {/*<Route path=":id" element={<FeedPage />} />*/}
          </Route>

          {/* Защищенные маршруты (только для авторизованных) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileInfoPage />} />
            <Route path="orders" element={<ProfileOrdersPage />} />
            {/*<Route path="orders/:id" element={<OrderPage />} />*/}
          </Route>

          {/* Отдельная страница ингредиента */}
          <Route path="/ingredients/:id" element={<IngredientPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Модальные окна поверх фонового маршрута */}
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
