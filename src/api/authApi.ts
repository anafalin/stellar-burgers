import { BASE_URL } from './constants';

// ================================================================
// ТИПЫ (Types)
// ================================================================

/**
 * Данные для входа
 */
interface LoginForm {
  email: string;
  password: string;
}

/**
 * Данные для регистрации
 */
interface RegisterForm {
  email: string;
  password: string;
  name: string;
}

/**
 * Данные для обновления токена
 */
interface TokenRefreshData {
  token: string;
}

/**
 * Ответ сервера с токенами
 */
interface TokensResponse {
  accessToken: string;
  refreshToken: string;
  success?: boolean;
}

/**
 * Ответ сервера с пользователем
 */
interface UserResponse {
  success: boolean;
  user: {
    email: string;
    name: string;
    _id: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Базовый ответ сервера
 */
interface BaseResponse {
  success: boolean;
  message?: string;
}

/**
 * Тип для ответа fetch
 */
type FetchResponse<T = any> = Response & {
  json(): Promise<T>;
};

// ================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ================================================================

/**
 * Базовые опции для fetch запросов
 *
 * @param {unknown} body - Тело запроса (будет преобразовано в JSON)
 * @returns {RequestInit} - Опции для fetch
 */
const getDefaultOptions = (body?: unknown): RequestInit => {
  const options: RequestInit = {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  // Добавляем body только если он передан
  if (body !== undefined && body !== null) {
    options.body = JSON.stringify(body);
  }

  return options;
};

/**
 * Проверка ответа сервера
 *
 * @template T - Тип ожидаемого ответа
 * @param {Response} response - Ответ от fetch
 * @returns {Promise<T>} - Распарсенные данные
 * @throws {Error} - Если ответ не успешный
 */
async function checkResponse<T = any>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = '';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `Ошибка ${response.status}`;
    } catch {
      errorMessage = `Ошибка ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * Обертка для fetch запросов с обработкой ошибок
 *
 * @template T - Тип ожидаемого ответа
 * @param {string} url - URL для запроса
 * @param {RequestInit} options - Опции fetch
 * @returns {Promise<T>} - Данные ответа сервера
 */
async function fetchWithCheck<T = any>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await checkResponse<T>(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    throw new Error(`Ошибка запроса к ${url}: ${errorMessage}`);
  }
}

// ================================================================
// API ФУНКЦИИ
// ================================================================

/**
 * Базовый URL для API авторизации
 */
const AUTH_API_URL = `${BASE_URL}/auth`;

/**
 * Запрос на вход в систему
 *
 * @async
 * @function loginRequest
 * @param {LoginForm} form - Данные для входа (email, password)
 * @returns {Promise<UserResponse>} - Ответ сервера с данными пользователя и токенами
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await loginRequest({
 *     email: 'user@example.com',
 *     password: 'securePassword123'
 *   });
 *   console.log('Успешный вход:', data.user);
 * } catch (error) {
 *   console.error('Ошибка входа:', error.message);
 * }
 */
export const loginRequest = async (form: LoginForm): Promise<UserResponse> => {
  return fetchWithCheck<UserResponse>(`${AUTH_API_URL}/login`, getDefaultOptions(form));
};

/**
 * Запрос на выход из системы
 *
 * @async
 * @function logoutRequest
 * @param {string} refreshToken - Refresh токен для выхода
 * @returns {Promise<BaseResponse>} - Ответ сервера
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await logoutRequest(refreshToken);
 *   console.log('Успешный выход');
 * } catch (error) {
 *   console.error('Ошибка выхода:', error.message);
 * }
 */
export const logoutRequest = async (refreshToken: string): Promise<BaseResponse> => {
  return fetchWithCheck<BaseResponse>(
    `${AUTH_API_URL}/logout`,
    getDefaultOptions({ token: refreshToken }),
  );
};

/**
 * Запрос на регистрацию нового пользователя
 *
 * @async
 * @function registerRequest
 * @param {RegisterForm} form - Данные для регистрации (email, password, name)
 * @returns {Promise<UserResponse>} - Ответ сервера с данными пользователя и токенами
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await registerRequest({
 *     email: 'newuser@example.com',
 *     password: 'securePassword123',
 *     name: 'Иван Петров'
 *   });
 *   console.log('Регистрация успешна:', data.user);
 * } catch (error) {
 *   console.error('Ошибка регистрации:', error.message);
 * }
 */
export const registerRequest = async (form: RegisterForm): Promise<UserResponse> => {
  return fetchWithCheck<UserResponse>(`${AUTH_API_URL}/register`, getDefaultOptions(form));
};

/**
 * Запрос на обновление токена доступа
 *
 * @async
 * @function tokenResetRequest
 * @param {string} refreshToken - Refresh токен для получения новой пары токенов
 * @returns {Promise<TokensResponse>} - Ответ сервера с новыми токенами
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await tokenResetRequest(refreshToken);
 *   console.log('Токены обновлены');
 *   // Сохраняем новые токены
 *   saveTokens(data.accessToken, data.refreshToken);
 * } catch (error) {
 *   console.error('Ошибка обновления токена:', error.message);
 * }
 */
export const tokenResetRequest = async (refreshToken: string): Promise<TokensResponse> => {
  return fetchWithCheck<TokensResponse>(
    `${AUTH_API_URL}/token`,
    getDefaultOptions({ token: refreshToken }),
  );
};

/**
 * Запрос на восстановление пароля
 *
 * @async
 * @function forgotPasswordRequest
 * @param {string} email - Email пользователя для восстановления
 * @returns {Promise<BaseResponse>} - Ответ сервера
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await forgotPasswordRequest('user@example.com');
 *   console.log('Письмо с кодом отправлено');
 * } catch (error) {
 *   console.error('Ошибка восстановления:', error.message);
 * }
 */
export const forgotPasswordRequest = async (email: string): Promise<BaseResponse> => {
  return fetchWithCheck<BaseResponse>(
    `${AUTH_API_URL}/password-reset`,
    getDefaultOptions({ email }),
  );
};

/**
 * Запрос на сброс пароля
 *
 * @async
 * @function resetPasswordRequest
 * @param {Object} data - Данные для сброса
 * @param {string} data.password - Новый пароль
 * @param {string} data.token - Токен подтверждения из письма
 * @returns {Promise<BaseResponse>} - Ответ сервера
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await resetPasswordRequest({
 *     password: 'newSecurePassword123',
 *     token: 'reset-token-from-email'
 *   });
 *   console.log('Пароль успешно изменен');
 * } catch (error) {
 *   console.error('Ошибка сброса пароля:', error.message);
 * }
 */
export const resetPasswordRequest = async (data: {
  password: string;
  token: string;
}): Promise<BaseResponse> => {
  return fetchWithCheck<BaseResponse>(
    `${AUTH_API_URL}/password-reset/reset`,
    getDefaultOptions(data),
  );
};

/**
 * Запрос на обновление данных пользователя
 *
 * @async
 * @function updateUserRequest
 * @param {Object} data - Данные для обновления
 * @param {string} [data.name] - Новое имя
 * @param {string} [data.email] - Новый email
 * @param {string} [data.password] - Новый пароль
 * @param {string} accessToken - Токен доступа для авторизации
 * @returns {Promise<UserResponse>} - Ответ сервера с обновленными данными
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await updateUserRequest(
 *     { name: 'Новое Имя' },
 *     accessToken
 *   );
 *   console.log('Данные обновлены:', data.user);
 * } catch (error) {
 *   console.error('Ошибка обновления:', error.message);
 * }
 */
export const updateUserRequest = async (
  data: Partial<RegisterForm>,
  accessToken: string,
): Promise<UserResponse> => {
  const options: RequestInit = {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  };

  return fetchWithCheck<UserResponse>(`${AUTH_API_URL}/user`, options);
};

/**
 * Запрос на получение данных текущего пользователя
 *
 * @async
 * @function getUserRequest
 * @param {string} accessToken - Токен доступа для авторизации
 * @returns {Promise<UserResponse>} - Ответ сервера с данными пользователя
 * @throws {Error} - Если запрос неудачен
 *
 * @example
 * try {
 *   const data = await getUserRequest(accessToken);
 *   console.log('Данные пользователя:', data.user);
 * } catch (error) {
 *   console.error('Ошибка получения данных:', error.message);
 * }
 */
export const getUserRequest = async (accessToken: string): Promise<UserResponse> => {
  const options: RequestInit = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  return fetchWithCheck<UserResponse>(`${AUTH_API_URL}/user`, options);
};

// ================================================================
// ЭКСПОРТ ТИПОВ ДЛЯ ИСПОЛЬЗОВАНИЯ В ДРУГИХ МОДУЛЯХ
// ================================================================

export type {
  LoginForm,
  RegisterForm,
  TokenRefreshData,
  TokensResponse,
  UserResponse,
  BaseResponse,
};
