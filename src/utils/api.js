import { AUTH_URL, BASE_URL } from '../api/constants';
import { getCookie, setCookie, deleteCookie } from './cookie';

/**
 * Универсальная функция для запросов к API
 * @param {string} endpoint - путь к ресурсу (например, '/ingredients')
 * @param {Object} options - опции для fetch (method, body, headers и т.д.)
 */
export async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return await checkResponse(res);
  } catch (error) {
    throw new Error(`Ошибка при запросе ${endpoint}: ${error.message}`);
  }
}

/**
 * Запрос с токеном (с автоматическим обновлением)
 */
export async function requestWithToken(endpoint, options = {}) {
  const token = getCookie('accessToken');

  if (!token) {
    throw new Error('Нет токена авторизации');
  }

  try {
    const data = await request(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    // Если ошибка 401 (неавторизован) - пробуем обновить токен
    if (error.message.includes('401') || error.message.includes('jwt expired')) {
      try {
        // Обновляем токен
        await refreshToken();
        // Повторяем запрос с новым токеном
        const newToken = getCookie('accessToken');
        return await request(endpoint, {
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
        throw new Error('Сессия истекла, войдите заново');
      }
    }
    throw error;
  }
}

/**
 * Проверка ответа сервера
 */
async function checkResponse(res) {
  if (!res.ok) {
    let errorMessage = '';
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || '';
    } catch {
      errorMessage = await res.text().catch(() => '');
    }

    const error = new Error(errorMessage || `Ошибка ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/**
 * Обновление токена
 */
async function refreshToken() {
  const refreshToken = getCookie('refreshToken');

  if (!refreshToken) {
    throw new Error('Нет refresh токена');
  }

  const res = await fetch(`${AUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  const data = await checkResponse(res);

  // Сохраняем новые токены
  setCookie('accessToken', data.accessToken.split('Bearer ')[1]);
  setCookie('refreshToken', data.refreshToken);

  return data;
}

// ===== УПРОЩЕННЫЕ МЕТОДЫ ДЛЯ УДОБСТВА =====

/**
 * GET запрос
 */
export async function get(endpoint, needAuth = false) {
  if (needAuth) {
    return requestWithToken(endpoint, { method: 'GET' });
  }
  return request(endpoint, { method: 'GET' });
}

/**
 * POST запрос
 */
export async function post(endpoint, data = {}, needAuth = false) {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
  };

  if (needAuth) {
    return requestWithToken(endpoint, options);
  }
  return request(endpoint, options);
}

/**
 * PATCH запрос
 */
export async function patch(endpoint, data = {}, needAuth = false) {
  const options = {
    method: 'PATCH',
    body: JSON.stringify(data),
  };

  if (needAuth) {
    return requestWithToken(endpoint, options);
  }
  return request(endpoint, options);
}

/**
 * DELETE запрос
 */
export async function del(endpoint, needAuth = false) {
  if (needAuth) {
    return requestWithToken(endpoint, { method: 'DELETE' });
  }
  return request(endpoint, { method: 'DELETE' });
}
