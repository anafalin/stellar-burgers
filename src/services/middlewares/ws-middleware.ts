import { Middleware, MiddlewareAPI } from 'redux';
import { AppDispatch, RootState } from '../index';
import { getAccessToken, updateTokens } from '../../utils/auth-cookies';

interface IActionCreator {
  type: string;
  match: (action: any) => boolean;
}

interface IActionCreatorWithPayload<P> extends IActionCreator {
  (payload: P): { type: string; payload: P };
}

export type TWsActions = {
  wsInit: IActionCreator;
  wsSend: IActionCreatorWithPayload<any>;
  wsClose: IActionCreator;
  onOpen: IActionCreator;
  onClose: IActionCreatorWithPayload<{ code: number; reason: string; wasClean: boolean }>;
  onError: IActionCreatorWithPayload<string>;
  onMessage: IActionCreatorWithPayload<any>;
};

const RECONNECT_DELAY = 3000;

export const socketMiddleware = (wsUrl: string, wsActions: TWsActions): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let shouldReconnect = false;
    let isRefreshingToken = false;

    const clearReconnectTimer = (): void => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const getSocketUrl = (): string => {
      if (wsUrl.includes('/all')) {
        return wsUrl;
      }

      // Для личной ленты пользователя — достаем и прикрепляем токен
      const token = getAccessToken();
      if (!token) return wsUrl;

      const cleanToken = token.replace('Bearer ', '');
      return `${wsUrl}?token=${cleanToken}`;
    };

    const setupSocketHandlers = (ws: WebSocket) => {
      ws.onopen = () => {
        clearReconnectTimer();
        store.dispatch({ type: wsActions.onOpen.type });
        console.log('[WS] Соединение установлено');
      };

      ws.onerror = () => {
        console.error('[WS] Ошибка соединения');
        store.dispatch({
          type: wsActions.onError.type,
          payload: 'WebSocket connection error',
        });
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[WS] Получено сообщение:', data);

          if (!data.success && data.message === 'Invalid or missing token') {
            console.warn('[WS] Токен недействителен, пытаемся обновить...');

            if (!isRefreshingToken) {
              isRefreshingToken = true;
              try {
                await updateTokens();
                ws.close();
                console.log('[WS] Токены обновлены. Ожидаем переподключения...');
              } catch (error) {
                console.error('[WS] Ошибка при обновлении токена:', error);
                store.dispatch({
                  type: wsActions.onError.type,
                  payload: error instanceof Error ? error.message : 'Token refresh error',
                });
              } finally {
                isRefreshingToken = false;
              }
            }
            return;
          }

          store.dispatch({ type: wsActions.onMessage.type, payload: data });
        } catch (parseError) {
          console.error('[WS] Ошибка парсинга сообщения:', parseError);
          store.dispatch({
            type: wsActions.onError.type,
            payload: parseError instanceof Error ? parseError.message : 'JSON parse error',
          });
        }
      };

      ws.onclose = (event) => {
        console.log('[WS] Соединение закрыто:', event.code, event.reason);

        if (socket === ws) {
          socket = null;
        }

        store.dispatch({
          type: wsActions.onClose.type,
          payload: {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          },
        });

        if (shouldReconnect && !isRefreshingToken) {
          clearReconnectTimer();
          reconnectTimer = setTimeout(() => {
            console.log('[WS] Попытка автоматического переподключения...');
            store.dispatch({ type: wsActions.wsInit.type });
          }, RECONNECT_DELAY);
        }
      };
    };

    return (next) => (action: any) => {
      if (wsActions.wsInit.match(action)) {
        shouldReconnect = true;

        if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
          console.log('[WS] Соединение уже устанавливается или открыто. Игнорируем дубликат.');
          return next(action);
        }

        if (socket) {
          socket.close();
          socket = null;
        }

        const rawUrl = getSocketUrl();
        const finalUrl = rawUrl.replace(/^http/, 'ws');
        console.log('[WS] Подключение к:', finalUrl);

        socket = new WebSocket(finalUrl);
        setupSocketHandlers(socket);
      }

      if (wsActions.wsSend.match(action)) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          console.log('[WS] Отправка сообщения:', action.payload);
          socket.send(JSON.stringify(action.payload));
        } else {
          console.warn('[WS] Сокет не готов. Состояние:', socket ? socket.readyState : 'сокета нет');
        }
      }

      if (wsActions.wsClose.match(action)) {
        console.log('[WS] Закрытие соединения по запросу пользователя');
        shouldReconnect = false;
        clearReconnectTimer();

        if (socket) {
          socket.close();
          socket = null;
        }
      }

      next(action);
    };
  }) as Middleware;
};
