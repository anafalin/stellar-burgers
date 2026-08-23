// utils/auth-cookies.ts

import { getCookie, setCookie, deleteCookie } from './cookie';
import { request } from './api';

/**
 * Интерфейс ответа с токенами
 */
interface TokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

/**
 * Сохраняет токены в cookies
 *
 * @param accessToken - Access токен (может быть с префиксом "Bearer " или без)
 * @param refreshToken - Refresh токен
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  // Убираем префикс "Bearer " если он есть
  const token = accessToken.startsWith('Bearer ') ? accessToken.split('Bearer ')[1] : accessToken;

  // Сохраняем access token (на 24 часа)
  setCookie('accessToken', token, { expires: 86400 });

  // Сохраняем refresh token (на 30 дней)
  setCookie('refreshToken', refreshToken, { expires: 2592000 });
};

/**
 * Получает access token из cookies
 *
 * @returns {string | undefined} - Access токен или undefined, если не найден
 */
export const getAccessToken = (): string | undefined => {
  return getCookie('accessToken');
};

/**
 * Получает refresh token из cookies
 *
 * @returns {string | undefined} - Refresh токен или undefined, если не найден
 */
export const getRefreshToken = (): string | undefined => {
  return getCookie('refreshToken');
};

/**
 * Удаляет токены из cookies (при выходе из системы)
 */
export const removeTokens = (): void => {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
};

/**
 * Обновляет токены используя refresh token
 *
 * @async
 * @function updateTokens
 * @returns {Promise<boolean>} - true если обновление успешно, false если нет
 * @throws {Error} - Если произошла ошибка при обновлении
 */
export const updateTokens = async (): Promise<boolean> => {
  try {
    // Получаем текущий refresh token
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      console.error('[Auth] Refresh token не найден в cookies');
      return false;
    }

    // Запрашиваем новые токены через API
    const response = await request<TokenResponse>('/auth/token', {
      method: 'POST',
      body: JSON.stringify({ token: refreshToken }),
    });

    // Проверяем успешность ответа
    if (response && response.success && response.accessToken && response.refreshToken) {
      // Сохраняем новые токены
      saveTokens(response.accessToken, response.refreshToken);
      console.log('[Auth] Токены успешно обновлены');
      return true;
    }

    console.error('[Auth] Сервер не вернул корректные токены');
    return false;
  } catch (error) {
    console.error('[Auth] Ошибка при обновлении токенов:', error);

    // Если обновление не удалось, удаляем токены
    removeTokens();

    throw error;
  }
};

/**
 * Проверяет, авторизован ли пользователь (есть ли токены)
 *
 * @returns {boolean} - true если есть оба токена
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return !!(accessToken && refreshToken);
};
