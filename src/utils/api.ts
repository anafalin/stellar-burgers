import { AUTH_URL, BASE_URL } from '../api/constants';
import { getCookie, setCookie, deleteCookie } from './cookie';

// ================================================================
// ТИПЫ (Types)
// ================================================================

/**
 * Ответ сервера с токенами
 */
interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Ошибка с дополнительным статусом
 */
interface ApiError extends Error {
  status?: number;
}

/**
 * Параметры запроса
 */
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Параметры для методов с данными (POST, PATCH)
 */
interface DataRequestOptions extends RequestOptions {
  body: string;
}

/**
 * Параметры для запросов с токеном
 */
interface RequestWithTokenOptions extends RequestOptions {
  headers?: Record<string, string>;
}

// ================================================================
// ОСНОВНЫЕ ФУНКЦИИ
// ================================================================

/**
 * Универсальная функция для запросов к API
 *
 * @template T - Тип ожидаемого ответа
 * @param {string} endpoint - путь к ресурсу (например, '/ingredients')
 * @param {RequestOptions} options - опции для fetch (method, body, headers и т.д.)
 * @returns {Promise<T>} - Данные ответа сервера
 * @throws {ApiError} - Ошибка с текстом и статусом
 *
 * @example
 * // GET запрос
 * const ingredients = await request<{ data: Ingredient[] }>('/ingredients');
 *
 * // POST запрос
 * const data = await request('/auth/login', {
 *   method: 'POST',
 *   body: JSON.stringify({ email, password })
 * });
 */
export async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return await checkResponse<T>(res);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    throw new Error(`Ошибка при запросе ${endpoint}: ${errorMessage}`);
  }
}

/**
 * Запрос с токеном (с автоматическим обновлением)
 *
 * @template T - Тип ожидаемого ответа
 * @param {string} endpoint - путь к ресурсу
 * @param {RequestWithTokenOptions} options - опции для fetch
 * @returns {Promise<T>} - Данные ответа сервера
 * @throws {ApiError} - Ошибка с текстом и статусом
 *
 * @example
 * const userData = await requestWithToken<{ user: IUser }>('/auth/user');
 */
export async function requestWithToken<T = any>(
  endpoint: string,
  options: RequestWithTokenOptions = {},
): Promise<T> {
  const token = getCookie('accessToken');

  if (!token) {
    throw new Error('Нет токена авторизации');
  }

  try {
    const data = await request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    // Если ошибка 401 (неавторизован) - пробуем обновить токен
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage.includes('401') || errorMessage.includes('jwt expired')) {
      try {
        // Обновляем токен
        await refreshToken();
        // Повторяем запрос с новым токеном
        const newToken = getCookie('accessToken');
        if (!newToken) {
          throw new Error('Не удалось получить новый токен');
        }
        return await request<T>(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (refreshError) {
        // Если не удалось обновить токен - очищаем всё и выбрасываем ошибку
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
        const error = new Error('Сессия истекла, войдите заново') as ApiError;
        error.status = 401;
        throw error;
      }
    }
    throw error;
  }
}

/**
 * Проверка ответа сервера
 *
 * @template T - Тип ожидаемого ответа
 * @param {Response} res - Ответ от fetch
 * @returns {Promise<T>} - Распарсенные данные
 * @throws {ApiError} - Ошибка с текстом и статусом
 *
 * @example
 * const response = await fetch('/api/data');
 * const data = await checkResponse<{ result: string }>(response);
 */
async function checkResponse<T = any>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = '';
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || '';
    } catch {
      // Если не удалось распарсить JSON, пробуем прочитать как текст
      try {
        errorMessage = await res.text();
      } catch {
        errorMessage = '';
      }
    }

    const error = new Error(errorMessage || `Ошибка ${res.status}`) as ApiError;
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/**
 * Обновление токена
 *
 * @returns {Promise<TokensResponse>} - Новые токены
 * @throws {ApiError} - Если нет refresh токена или запрос неудачен
 *
 * @example
 * try {
 *   const { accessToken, refreshToken } = await refreshToken();
 *   console.log('Токены обновлены');
 * } catch (error) {
 *   console.error('Не удалось обновить токены');
 * }
 */
async function refreshToken(): Promise<TokensResponse> {
  const refreshTokenValue = getCookie('refreshToken');

  if (!refreshTokenValue) {
    throw new Error('Нет refresh токена');
  }

  const res = await fetch(`${AUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshTokenValue }),
  });

  const data = await checkResponse<TokensResponse>(res);

  // Сохраняем новые токены
  const accessToken = data.accessToken.split('Bearer ')[1] || data.accessToken;
  setCookie('accessToken', accessToken);
  setCookie('refreshToken', data.refreshToken);

  return data;
}

// ================================================================
// УПРОЩЕННЫЕ МЕТОДЫ ДЛЯ УДОБСТВА
// ================================================================

/**
 * GET запрос
 *
 * @template T - Тип ожидаемого ответа
 * @param {string} endpoint - путь к ресурсу
 * @param {boolean} needAuth - требуется ли авторизация
 * @returns {Promise<T>} - Данные ответа сервера
 *
 * @example
 * const data = await get<{ ingredients: Ingredient[] }>('/ingredients');
 * const user = await get<{ user: IUser }>('/auth/user', true);
 */
export async function get<T = any>(endpoint: string, needAuth: boolean = false): Promise<T> {
  if (needAuth) {
    return requestWithToken<T>(endpoint, { method: 'GET' });
  }
  return request<T>(endpoint, { method: 'GET' });
}

/**
 * POST запрос
 *
 * @template T - Тип ожидаемого ответа
 * @param {string} endpoint - путь к ресурсу
 * @param {Record<string, any>} data - данные для отправки
 * @param {boolean} needAuth - требуется ли авторизация
 * @returns {Promise<T>} - Данные ответа сервера
 *
 * @example
 * const result = await post<{ success: boolean }>('/auth/login', { email, password });
 * const newItem = await post<{ item: Item }>('/items', itemData, true);
 */
export async function post<T = any>(
  endpoint: string,
  data: Record<string, any> = {},
  needAuth: boolean = false,
): Promise<T> {
  const options: DataRequestOptions = {
    method: 'POST',
    body: JSON.stringify(data),
  };

  if (needAuth) {
    return requestWithToken<T>(endpoint, options);
  }
  return request<T>(endpoint, options);
}

/**
 * PATCH запрос
 *
 * @template T - Тип ожидаемого ответа
 * @param {string} endpoint - путь к ресурсу
 * @param {Record<string, any>} data - данные для обновления
 * @param {boolean} needAuth - требуется ли авторизация
 * @returns {Promise<T>} - Данные ответа сервера
 *
 * @example
 * const updated = await patch<{ user: IUser }>('/auth/user', { name: 'Новое имя' }, true);
 */
export async function patch<T = any>(
  endpoint: string,
  data: Record<string, any> = {},
  needAuth: boolean = false,
): Promise<T> {
  const options: DataRequestOptions = {
    method: 'PATCH',
    body: JSON.stringify(data),
  };

  if (needAuth) {
    return requestWithToken<T>(endpoint, options);
  }
  return request<T>(endpoint, options);
}

/**
 * DELETE запрос
 *
 * @template T - Тип ожидаемого ответа
 * @param {string} endpoint - путь к ресурсу
 * @param {boolean} needAuth - требуется ли авторизация
 * @returns {Promise<T>} - Данные ответа сервера
 *
 * @example
 * await delete('/items/123', true);
 */
export async function del<T = any>(endpoint: string, needAuth: boolean = false): Promise<T> {
  if (needAuth) {
    return requestWithToken<T>(endpoint, { method: 'DELETE' });
  }
  return request<T>(endpoint, { method: 'DELETE' });
}

// ================================================================
// ЭКСПОРТ ТИПОВ ДЛЯ ИСПОЛЬЗОВАНИЯ В ДРУГИХ МОДУЛЯХ
// ================================================================

export type {
  TokensResponse,
  ApiError,
  RequestOptions,
  RequestWithTokenOptions,
  DataRequestOptions,
};
