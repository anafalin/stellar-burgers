import { createReducer } from '@reduxjs/toolkit';
import { IUserFeedState } from '../../utils/types';
import { userFeedWsActions } from './actions';

const initialState: IUserFeedState = {
  wsError: null,
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0,
};

export const userFeedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(userFeedWsActions.wsInit, (state) => {
      state.wsError = null;
    })
    .addCase(userFeedWsActions.onOpen, (state) => {
      state.wsConnected = true;
      state.wsError = null;
    })
    .addCase(userFeedWsActions.onError, (state, action) => {
      state.wsError = action.payload;
    })
    .addCase(userFeedWsActions.onClose, (state) => {
      state.wsConnected = false;
      state.orders = [];
    })
    .addCase(userFeedWsActions.onMessage, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
});
