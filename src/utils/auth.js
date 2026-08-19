import React, { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { request, requestWithToken } from '../utils/api';


/**
 * Контейнер для данных авторизации
 * Все компоненты, обернутые в ProvideAuth, получат доступ к этим данным
 * Значение по умолчанию - undefined (пока данные не добавлены)
 */
const AuthContext = createContext(undefined);

/**
 * Хук для доступа к данным. Используется в любом компоненте, чтобы получить данные и функции авторизации.
 * @return объект со всеми данными и функциями авторизации
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Этот компонент оборачивает всё приложение и предоставляет данные авторизации всем дочерним компонентам.
 * @param {ReactNode} children - дочерние компоненты, которые получат доступ к данным авторизации
 */
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * ============================================================
 * ХУК АВТОРИЗАЦИИ
 * ============================================================
 *
 * Этот хук содержит всю бизнес-логику авторизации в приложении.
 * Он управляет состояниями пользователя, загрузки и ошибок,
 * а также предоставляет методы для работы с аутентификацией.
 *
 * @returns {Object} Объект со всеми состояниями и методами авторизации
 *
 * @example
 * // Использование в компоненте:
 * const { user, signIn, signOut, loading } = useProvideAuth();
 * await signIn({ email: 'user@example.com', password: '123' });
 */

/**
 * Основной хук авторизации
 *
 * @function useProvideAuth
 * @returns {Object} Объект с состояниями и методами
 */
function useProvideAuth() {
  // ================================================================
  // СОСТОЯНИЯ (State)
  // ================================================================

  /**
   * @state user - Данные текущего авторизованного пользователя
   * @type {Object|null}
   *
   * @example
   * // user = { email: 'user@example.com', name: 'Иван', _id: '123' }
   */
  const [user, setUser] = useState(null);

  /**
   * @state loading - Флаг загрузки
   * @type {boolean}
   *
   * true - выполняется асинхронный запрос к серверу
   * false - запрос завершен или не выполняется
   *
   * Используется для:
   * - Блокировки кнопок во время запроса
   * - Отображения спиннера загрузки
   * - Предотвращения повторных кликов
   *
   * @example
   * <button disabled={loading}>
   *   {loading ? 'Загрузка...' : 'Войти'}
   * </button>
   */
  const [loading, setLoading] = useState(false);

  /**
   * @state error - Сообщение об ошибке
   * @type {string|null}
   *
   * null - ошибки нет
   * string - текст ошибки для отображения пользователю
   *
   * Ошибки могут быть:
   * - "Пользователь с таким email уже существует"
   * - "Неверный email или пароль"
   * - "Сервер не вернул токен доступа"
   * - "Сессия истекла, войдите заново"
   *
   * @example
   * {error && <p style={{color: 'red'}}>{error}</p>}
   */
  const [error, setError] = useState(null);

  /**
   * @state isForgotPasswordVisited - Флаг посещения страницы восстановления
   * @type {boolean}
   *
   * Используется для защиты маршрута /reset-password:
   * - true - пользователь был на /forgot-password, можно перейти на /reset-password
   * - false - пользователь не был на /forgot-password, доступ запрещен
   *
   * Сбрасывается после успешного сброса пароля
   *
   * @example
   * if (!isForgotPasswordVisited) {
   *   return <Navigate to="/forgot-password" replace />;
   * }
   */
  const [isForgotPasswordVisited, setIsForgotPasswordVisited] = useState(false);

  // ================================================================
  // ЭФФЕКТЫ (Effects)
  // ================================================================

  /**
   * @effect Проверка токена при загрузке приложения
   *
   * При монтировании компонента проверяет наличие accessToken в куках.
   * Если токен есть - пытается восстановить сессию пользователя.
   *
   * Это позволяет пользователю оставаться авторизованным после
   * перезагрузки страницы или закрытия браузера.
   *
   * @fires getUser - при наличии валидного токена
   *
   * @example
   * // При загрузке страницы автоматически проверяется:
   * // 1. Есть ли токен в куках
   * // 2. Если есть - получаем данные пользователя
   * // 3. Если нет - пользователь считается неавторизованным
   */
  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      getUser(); // Восстанавливаем сессию
    }
  }, []); // Пустой массив = выполняется только один раз

  // ================================================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ================================================================

  /**
   * @function withLoading - Обертка для асинхронных операций
   *
   * Автоматически управляет состояниями loading и error:
   * 1. Устанавливает loading = true (начало загрузки)
   * 2. Сбрасывает error = null (очищает предыдущую ошибку)
   * 3. Выполняет переданную асинхронную функцию
   * 4. При успехе - возвращает результат
   * 5. При ошибке - сохраняет сообщение в error и пробрасывает ошибку
   * 6. В любом случае устанавливает loading = false (конец загрузки)
   *
   * @async
   * @function withLoading
   * @param {Function} callback - Асинхронная функция для выполнения
   * @returns {Promise<any>} - Результат выполнения callback
   * @throws {Error} - Пробрасывает ошибку из callback
   *
   * @example
   * // Использование в методах:
   * const signIn = async (userData) => {
   *   return withLoading(async () => {
   *     const data = await request('/auth/login', { ... });
   *     return data;
   *   });
   * };
   *
   * // В компоненте:
   * try {
   *   await signIn({ email, password });
   * } catch (error) {
   *   // error.message автоматически сохранится в state.error
   * }
   */
  const withLoading = async (callback) => {
    setLoading(true);
    setError(null);
    try {
      return await callback();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function saveTokens - Сохранение токенов в куки
   *
   * Сохраняет accessToken и refreshToken в куки браузера.
   * accessToken приходит от сервера в формате "Bearer <token>".
   * Метод автоматически отрезает префикс "Bearer " и сохраняет только токен.
   *
   * @param {string} accessToken - JWT токен доступа (с префиксом "Bearer ")
   * @param {string} refreshToken - Refresh токен для обновления сессии
   * @returns {boolean} - true если токены сохранены, false если ошибка
   *
   * @throws {Error} - Если accessToken отсутствует
   *
   * @example
   * // Ответ сервера:
   * const data = {
   *   accessToken: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   *   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * };
   *
   * // Сохраняем:
   * saveTokens(data.accessToken, data.refreshToken);
   * // В куках будет: accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  const saveTokens = (accessToken, refreshToken) => {
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
   * @function clearTokens - Удаление токенов из кук
   *
   * Полностью удаляет accessToken и refreshToken из кук браузера.
   * Вызывается при:
   * - Выходе из системы (signOut)
   * - Ошибке обновления токена
   * - Истечении сессии
   *
   * @returns {void}
   *
   * @example
   * // При выходе:
   * clearTokens();
   * setUser(null);
   */
  const clearTokens = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
  };

  // ================================================================
  // ОСНОВНЫЕ МЕТОДЫ АВТОРИЗАЦИИ
  // ================================================================

  /**
   * @function refreshToken - Обновление токена доступа
   *
   * Отправляет POST запрос к /auth/token с refreshToken из кук.
   * При успехе сохраняет новые токены.
   * При ошибке очищает токены и разлогинивает пользователя.
   *
   * Используется автоматически при ошибке 401 (jwt expired) в запросах.
   *
   * @async
   * @function refreshToken
   * @returns {Promise<Object>} - Ответ сервера с новыми токенами
   * @property {string} accessToken - Новый токен доступа
   * @property {string} refreshToken - Новый refresh токен
   * @throws {Error} - Если refreshToken отсутствует или запрос неудачен
   *
   * @example
   * // Автоматическое обновление:
   * try {
   *   const data = await requestWithToken('/auth/user');
   * } catch (error) {
   *   if (error.message.includes('jwt expired')) {
   *     await refreshToken(); // Обновляем токен
   *     // Повторяем запрос
   *   }
   * }
   */
  const refreshToken = async () => {
    try {
      const refreshTokenValue = getCookie('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('Нет refresh токена');
      }

      const data = await request('/auth/token', {
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
   * @function getUser - Получение данных текущего пользователя
   *
   * Отправляет GET запрос к /auth/user с токеном в заголовке Authorization.
   * Если токен просрочен (ошибка 401) - автоматически обновляет его
   * и повторяет запрос.
   *
   * Используется для:
   * - Восстановления сессии при загрузке приложения
   * - Проверки актуальности данных пользователя
   *
   * @async
   * @function getUser
   * @returns {Promise<Object>} - Данные пользователя
   * @property {Object} user - Объект пользователя
   * @property {string} user.email - Email пользователя
   * @property {string} user.name - Имя пользователя
   * @property {string} user._id - ID пользователя
   * @throws {Error} - Если запрос неудачен
   *
   * @example
   * // Восстановление сессии:
   * useEffect(() => {
   *   const token = getCookie('accessToken');
   *   if (token) {
   *     getUser(); // Получаем данные пользователя
   *   }
   * }, []);
   *
   * // В компоненте:
   * const { getUser, user } = useProvideAuth();
   * await getUser();
   * console.log(user.name); // "Иван"
   */
  const getUser = async () => {
    try {
      const data = await requestWithToken('/auth/user', { method: 'GET' });
      setUser(data.user);
      return data;
    } catch (error) {
      if (error.message.includes('jwt expired') || error.message.includes('401')) {
        await refreshToken();
        return getUser();
      }
      throw error;
    }
  };

  /**
   * @function register - Регистрация нового пользователя
   *
   * Отправляет POST запрос к /auth/register с данными нового пользователя.
   * При успехе:
   * 1. Сохраняет токены в куки
   * 2. Сохраняет данные пользователя в состояние
   * 3. Возвращает ответ сервера
   *
   * @async
   * @function register
   * @param {Object} userData - Данные для регистрации
   * @param {string} userData.email - Email пользователя (должен быть уникальным)
   * @param {string} userData.password - Пароль пользователя (минимум 6 символов)
   * @param {string} userData.name - Имя пользователя
   * @returns {Promise<Object>} - Ответ сервера
   * @property {boolean} success - true если регистрация успешна
   * @property {Object} user - Данные зарегистрированного пользователя
   * @property {string} accessToken - Токен доступа
   * @property {string} refreshToken - Refresh токен
   * @throws {Error} - Если email уже занят или данные некорректны
   *
   * @example
   * // Регистрация нового пользователя:
   * try {
   *   await register({
   *     email: 'user@example.com',
   *     password: 'securePassword123',
   *     name: 'Иван Петров'
   *   });
   *   navigate('/'); // Переход на главную
   * } catch (error) {
   *   console.error(error.message); // "Пользователь с таким email уже существует"
   * }
   *
   * // В форме регистрации:
   * const handleSubmit = async (e) => {
   *   e.preventDefault();
   *   try {
   *     await register({ email, password, name });
   *     navigate('/login');
   *   } catch (error) {
   *     setFormError(error.message);
   *   }
   * };
   */
  const register = async (userData) => {
    return withLoading(async () => {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      console.log('[Auth] Register response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Ошибка регистрации');
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
   * @function signIn - Вход в систему
   *
   * Отправляет POST запрос к /auth/login с email и паролем.
   * При успехе:
   * 1. Сохраняет токены в куки
   * 2. Сохраняет данные пользователя в состояние
   * 3. Возвращает ответ сервера
   *
   * @async
   * @function signIn
   * @param {Object} credentials - Учетные данные
   * @param {string} credentials.email - Email пользователя
   * @param {string} credentials.password - Пароль пользователя
   * @returns {Promise<Object>} - Ответ сервера
   * @property {boolean} success - true если вход успешен
   * @property {Object} user - Данные пользователя
   * @property {string} accessToken - Токен доступа
   * @property {string} refreshToken - Refresh токен
   * @throws {Error} - Если email или пароль неверны
   *
   * @example
   * // Вход в систему:
   * try {
   *   await signIn({
   *     email: 'user@example.com',
   *     password: 'securePassword123'
   *   });
   *   navigate('/'); // Переход на главную
   * } catch (error) {
   *   console.error(error.message); // "Неверный email или пароль"
   * }
   *
   * // В форме входа:
   * const handleSubmit = async (e) => {
   *   e.preventDefault();
   *   try {
   *     await signIn({ email, password });
   *     navigate('/profile');
   *   } catch (error) {
   *     setError(error.message);
   *   }
   * };
   */
  const signIn = async (userData) => {
    return withLoading(async () => {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      console.log('[Auth] Login response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Ошибка входа');
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
   * @function signOut - Выход из системы
   *
   * Отправляет POST запрос к /auth/logout с refreshToken из кук.
   * При успехе:
   * 1. Удаляет токены из кук
   * 2. Очищает данные пользователя
   *
   * После выхода пользователя нужно перенаправить на страницу входа.
   *
   * @async
   * @function signOut
   * @returns {Promise<void>}
   * @throws {Error} - Если запрос неудачен
   *
   * @example
   * // Выход из системы:
   * const handleLogout = async () => {
   *   try {
   *     await signOut();
   *     navigate('/login');
   *   } catch (error) {
   *     console.error(error.message);
   *   }
   * };
   *
   * // В компоненте:
   * <button onClick={handleLogout}>
   *   {loading ? 'Выход...' : 'Выйти'}
   * </button>
   */
  const signOut = async () => {
    return withLoading(async () => {
      const refreshTokenValue = getCookie('refreshToken');
      await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ token: refreshTokenValue }),
      });

      clearTokens();
      setUser(null);
    });
  };

  /**
   * @function forgotPassword - Восстановление пароля
   *
   * Отправляет POST запрос к /password-reset с email пользователя.
   * При успехе:
   * 1. На указанный email отправляется письмо с кодом для сброса
   * 2. Устанавливается флаг isForgotPasswordVisited = true
   *
   * После успешного запроса пользователя нужно перенаправить
   * на страницу /reset-password для ввода нового пароля и кода.
   *
   * @async
   * @function forgotPassword
   * @param {string} email - Email пользователя для восстановления
   * @returns {Promise<Object>} - Ответ сервера
   * @property {boolean} success - true если запрос успешен
   * @property {string} message - "Reset email sent"
   * @throws {Error} - Если email не найден или ошибка сервера
   *
   * @example
   * // Запрос на восстановление:
   * try {
   *   await forgotPassword('user@example.com');
   *   navigate('/reset-password');
   * } catch (error) {
   *   console.error(error.message); // "Пользователь с таким email не найден"
   * }
   *
   * // В форме восстановления:
   * const handleSubmit = async (e) => {
   *   e.preventDefault();
   *   try {
   *     await forgotPassword(email);
   *     navigate('/reset-password');
   *   } catch (error) {
   *     setError(error.message);
   *   }
   * };
   */
  const forgotPassword = async (email) => {
    return withLoading(async () => {
      const data = await request('/password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!data.success) {
        throw new Error(data.message || 'Ошибка восстановления пароля');
      }

      setIsForgotPasswordVisited(true);
      return data;
    });
  };

  /**
   * @function resetPassword - Сброс пароля
   *
   * Отправляет POST запрос к /password-reset/reset с новым паролем
   * и токеном из письма.
   * При успехе:
   * 1. Пароль пользователя изменяется
   * 2. Сбрасывается флаг isForgotPasswordVisited = false
   *
   * После успешного сброса пользователя нужно перенаправить
   * на страницу входа /login.
   *
   * @async
   * @function resetPassword
   * @param {Object} data - Данные для сброса
   * @param {string} data.password - Новый пароль (минимум 6 символов)
   * @param {string} data.token - Код из письма для подтверждения
   * @returns {Promise<Object>} - Ответ сервера
   * @property {boolean} success - true если сброс успешен
   * @property {string} message - "Password successfully reset"
   * @throws {Error} - Если код неверен или пароль слабый
   *
   * @example
   * // Сброс пароля:
   * try {
   *   await resetPassword({
   *     password: 'newSecurePassword123',
   *     token: 'code_from_email'
   *   });
   *   navigate('/login');
   * } catch (error) {
   *   console.error(error.message); // "Неверный код подтверждения"
   * }
   *
   * // В форме сброса:
   * const handleSubmit = async (e) => {
   *   e.preventDefault();
   *   try {
   *     await resetPassword({ password, token });
   *     navigate('/login');
   *   } catch (error) {
   *     setError(error.message);
   *   }
   * };
   */
  const resetPassword = async (data) => {
    return withLoading(async () => {
      const result = await request('/auth/password-reset/reset', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!result.success) {
        throw new Error(result.message || 'Ошибка сброса пароля');
      }

      setIsForgotPasswordVisited(false);
      return result;
    });
  };

  /**
   * @function updateUser - Обновление данных пользователя
   *
   * Отправляет PATCH запрос к /auth/user с новыми данными.
   * Можно обновить:
   * - Имя (name)
   * - Email (email)
   * - Пароль (password)
   *
   * При успехе обновляет данные пользователя в состоянии.
   * Если токен просрочен - автоматически обновляет его и повторяет запрос.
   *
   * @async
   * @function updateUser
   * @param {Object} userData - Данные для обновления
   * @param {string} [userData.name] - Новое имя пользователя
   * @param {string} [userData.email] - Новый email пользователя
   * @param {string} [userData.password] - Новый пароль пользователя
   * @returns {Promise<Object>} - Обновленные данные пользователя
   * @property {boolean} success - true если обновление успешно
   * @property {Object} user - Обновленные данные пользователя
   * @throws {Error} - Если данные некорректны или email уже занят
   *
   * @example
   * // Обновление имени:
   * try {
   *   await updateUser({ name: 'Новое Имя' });
   *   console.log('Имя обновлено!');
   * } catch (error) {
   *   console.error(error.message);
   * }
   *
   * // Обновление нескольких полей:
   * try {
   *   await updateUser({
   *     name: 'Новое Имя',
   *     email: 'newemail@example.com'
   *   });
   * } catch (error) {
   *   console.error(error.message);
   * }
   *
   * // В форме профиля:
   * const handleSave = async () => {
   *   try {
   *     await updateUser({
   *       name: form.name,
   *       email: form.email,
   *       password: form.password || undefined // Не отправляем пустой пароль
   *     });
   *     alert('Данные обновлены!');
   *   } catch (error) {
   *     setError(error.message);
   *   }
   * };
   */
  const updateUser = async (userData) => {
    return withLoading(async () => {
      try {
        const data = await requestWithToken('/auth/user', {
          method: 'PATCH',
          body: JSON.stringify(userData),
        });

        if (!data.success) {
          throw new Error(data.message || 'Ошибка обновления данных');
        }

        setUser(data.user);
        return data;
      } catch (error) {
        if (error.message.includes('jwt expired') || error.message.includes('401')) {
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

  /**
   * @returns {Object} Объект со всеми состояниями и методами
   *
   * @property {Object|null} user - Данные текущего пользователя
   * @property {boolean} loading - Флаг загрузки
   * @property {string|null} error - Сообщение об ошибке
   * @property {boolean} isForgotPasswordVisited - Флаг восстановления пароля
   *
   * @property {Function} register - Регистрация нового пользователя
   * @property {Function} signIn - Вход в систему
   * @property {Function} signOut - Выход из системы
   * @property {Function} getUser - Получение данных пользователя
   * @property {Function} updateUser - Обновление данных пользователя
   * @property {Function} forgotPassword - Восстановление пароля
   * @property {Function} resetPassword - Сброс пароля
   * @property {Function} refreshToken - Обновление токена
   *
   * @example
   * // Полное использование в компоненте:
   * const ProfilePage = () => {
   *   const {
   *     user,
   *     loading,
   *     error,
   *     updateUser,
   *     signOut
   *   } = useProvideAuth();
   *
   *   if (loading) return <Spinner />;
   *   if (error) return <ErrorMessage error={error} />;
   *
   *   return (
   *     <div>
   *       <h1>Привет, {user?.name}!</h1>
   *       <button onClick={() => updateUser({ name: 'Новое имя' })}>
   *         Обновить имя
   *       </button>
   *       <button onClick={signOut}>Выйти</button>
   *     </div>
   *   );
   * };
   */
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
