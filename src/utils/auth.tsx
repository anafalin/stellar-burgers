import React, { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { deleteCookie, getCookie, setCookie } from './cookie';
import { request, requestWithToken } from '../utils/api';

// ================================================================
// ТИПЫ (Types)
// ================================================================

/**
 * Данные пользователя
 */
export interface User {
  email: string;
  name: string;
  _id?: string;
}

/**
 * Базовый ответ сервера
 */
export interface BaseResponse {
  success: boolean;
  message?: string;
}

/**
 * Ответ сервера с пользователем
 */
export interface UserResponse extends BaseResponse {
  user: User;
}

/**
 * Ответ сервера с токенами
 */
export interface TokenResponse extends BaseResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Ответ сервера при регистрации/авторизации
 */
export interface AuthResponse extends TokenResponse {
  user: User;
}

/**
 * Ответ сервера при сбросе пароля
 */
export interface PasswordResetResponse extends BaseResponse {
  message: string;
}

/**
 * Данные для регистрации
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * Данные для входа
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Данные для сброса пароля
 */
export interface ResetPasswordData {
  password: string;
  token: string;
}

/**
 * Данные для обновления пользователя
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Тип контекста авторизации
 */
export interface AuthContextType {
  // Состояния
  user: User | null;
  loading: boolean;
  error: string | null;
  isForgotPasswordVisited: boolean;

  // Методы
  register: (userData: RegisterData) => Promise<AuthResponse>;
  signIn: (credentials: LoginData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  getUser: () => Promise<UserResponse>;
  updateUser: (userData: UpdateUserData) => Promise<UserResponse>;
  forgotPassword: (email: string) => Promise<PasswordResetResponse>;
  resetPassword: (data: ResetPasswordData) => Promise<PasswordResetResponse>;
  refreshToken: () => Promise<TokenResponse>;
}

// ================================================================
// КОНТЕКСТ
// ================================================================

/**
 * Контейнер для данных авторизации
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Хук для доступа к данным авторизации
 * @returns {AuthContextType} Объект со всеми данными и функциями авторизации
 * @throws {Error} Если используется вне ProvideAuth
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ProvideAuth');
  }
  return context;
}

/**
 * Пропсы для ProvideAuth
 */
interface ProvideAuthProps {
  children: ReactNode;
}

/**
 * Провайдер авторизации
 */
export function ProvideAuth({ children }: ProvideAuthProps): React.ReactElement {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// ================================================================
// ХУК АВТОРИЗАЦИИ
// ================================================================

/**
 * Основной хук авторизации
 */
function useProvideAuth(): AuthContextType {
  // ================================================================
  // СОСТОЯНИЯ (State)
  // ================================================================

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordVisited, setIsForgotPasswordVisited] = useState<boolean>(false);

  // ================================================================
  // ЭФФЕКТЫ (Effects)
  // ================================================================

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      getUser().catch(() => {
        // Ошибка восстановления сессии — просто игнорируем
      });
    }
  }, []);

  // ================================================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ================================================================

  /**
   * Обертка для асинхронных операций с управлением loading и error
   */
  const withLoading = async <T,>(callback: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await callback();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Сохранение токенов в куки
   */
  const saveTokens = (accessToken: string, refreshToken: string): boolean => {
    if (!accessToken) {
      console.error('[Auth] accessToken отсутствует!');
      return false;
    }
    try {
      const token = accessToken.split('Bearer ')[1] || accessToken;
      setCookie('accessToken', token);
      setCookie('refreshToken', refreshToken);
      return true;
    } catch (error) {
      console.error('[Auth] Ошибка при сохранении токена:', error);
      return false;
    }
  };

  /**
   * Удаление токенов из кук
   */
  const clearTokens = (): void => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
  };

  /**
   * Получение сообщения об ошибке из ответа сервера
   */
  const getErrorMessage = (data: BaseResponse): string => {
    return data.message || 'Произошла ошибка';
  };

  // ================================================================
  // ОСНОВНЫЕ МЕТОДЫ АВТОРИЗАЦИИ
  // ================================================================

  /**
   * Обновление токена доступа
   */
  const refreshToken = async (): Promise<TokenResponse> => {
    try {
      const refreshTokenValue = getCookie('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('Нет refresh токена');
      }

      const data = await request<TokenResponse>('/auth/token', {
        method: 'POST',
        body: JSON.stringify({ token: refreshTokenValue }),
      });

      if (!data.accessToken) {
        throw new Error('Сервер не вернул новый токен');
      }

      saveTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    }
  };

  /**
   * Получение данных текущего пользователя
   */
  const getUser = async (): Promise<UserResponse> => {
    try {
      const data = await requestWithToken<UserResponse>('/auth/user', { method: 'GET' });
      setUser(data.user);
      return data;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('jwt expired') || error.message.includes('401'))
      ) {
        await refreshToken();
        return getUser();
      }
      throw error;
    }
  };

  /**
   * Регистрация нового пользователя
   */
  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    return withLoading(async () => {
      const data = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      console.log('[Auth] Register response:', data);

      if (!data.success) {
        throw new Error(getErrorMessage(data));
      }
      if (!data.accessToken) {
        throw new Error('Сервер не вернул токен доступа');
      }

      saveTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      return data;
    });
  };

  /**
   * Вход в систему
   */
  const signIn = async (credentials: LoginData): Promise<AuthResponse> => {
    return withLoading(async () => {
      const data = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('[Auth] Login response:', data);

      if (!data.success) {
        throw new Error(getErrorMessage(data));
      }
      if (!data.accessToken) {
        throw new Error('Сервер не вернул токен доступа');
      }

      saveTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      return data;
    });
  };

  /**
   * Выход из системы
   */
  const signOut = async (): Promise<void> => {
    return withLoading(async () => {
      const refreshTokenValue = getCookie('refreshToken');
      await request<BaseResponse>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ token: refreshTokenValue }),
      });

      clearTokens();
      setUser(null);
    });
  };

  /**
   * Восстановление пароля
   */
  const forgotPassword = async (email: string): Promise<PasswordResetResponse> => {
    return withLoading(async () => {
      const data = await request<PasswordResetResponse>('/password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!data.success) {
        throw new Error(getErrorMessage(data));
      }

      setIsForgotPasswordVisited(true);
      return data;
    });
  };

  /**
   * Сброс пароля
   */
  const resetPassword = async (data: ResetPasswordData): Promise<PasswordResetResponse> => {
    return withLoading(async () => {
      const result = await request<PasswordResetResponse>('/password-reset/reset', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!result.success) {
        throw new Error(getErrorMessage(result));
      }

      setIsForgotPasswordVisited(false);
      return result;
    });
  };

  /**
   * Обновление данных пользователя
   */
  const updateUser = async (userData: UpdateUserData): Promise<UserResponse> => {
    return withLoading(async () => {
      try {
        const data = await requestWithToken<UserResponse>('/auth/user', {
          method: 'PATCH',
          body: JSON.stringify(userData),
        });

        if (!data.success) {
          throw new Error(getErrorMessage(data));
        }

        setUser(data.user);
        return data;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.includes('jwt expired') || error.message.includes('401'))
        ) {
          await refreshToken();
          return updateUser(userData);
        }
        throw error;
      }
    });
  };

  // ================================================================
  // ВОЗВРАЩАЕМЫЙ ОБЪЕКТ
  // ================================================================

  return {
    // Состояния
    user,
    loading,
    error,
    isForgotPasswordVisited,

    // Методы
    register,
    signIn,
    signOut,
    getUser,
    updateUser,
    forgotPassword,
    resetPassword,
    refreshToken,
  };
}