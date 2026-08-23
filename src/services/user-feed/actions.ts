import { createAction } from '@reduxjs/toolkit';

export const userFeedWsInit = createAction('USER_FEED_WS_INIT');
export const userFeedWsSend = createAction<any>('USER_FEED_WS_SEND');
export const userFeedWsClose = createAction('USER_FEED_WS_CLOSE');

export const userFeedWsActions = {
  wsInit: userFeedWsInit,
  wsSend: userFeedWsSend,
  wsClose: userFeedWsClose,
  onOpen: createAction('USER_FEED_WS_OPEN'),
  onClose: createAction<{ code: number; reason: string; wasClean: boolean }>('USER_FEED_WS_ON_CLOSE'),
  onError: createAction<string>('USER_FEED_WS_ERROR'),
  onMessage: createAction<any>('USER_FEED_WS_MESSAGE'),
};
