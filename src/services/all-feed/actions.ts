import { createAction } from '@reduxjs/toolkit';

export const allFeedWsInit = createAction('ALL_FEED_WS_INIT');
export const allFeedWsSend = createAction<any>('ALL_FEED_WS_SEND');
export const allFeedWsClose = createAction('ALL_FEED_WS_CLOSE');

export const allFeedWsActions = {
  wsInit: allFeedWsInit,
  wsSend: allFeedWsSend,
  wsClose: allFeedWsClose,
  onOpen: createAction('ALL_FEED_WS_OPEN'),
  onClose: createAction<{ code: number; reason: string; wasClean: boolean }>('ALL_FEED_WS_ON_CLOSE'),
  onError: createAction<string>('ALL_FEED_WS_ERROR'),
  onMessage: createAction<any>('ALL_FEED_WS_MESSAGE'),
};
