import { createReducer } from '@reduxjs/toolkit';
import { IAllFeedState } from '../../utils/types'; // Поменяйте тип состояния под ваш IAllFeedState если нужно
import { allFeedWsActions } from './actions';

const initialState: any = {
  wsError: '',
  wsConnected: false,
  orders: [],
  total: 0,
  totalToday: 0,
};

export const allFeedReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(allFeedWsActions.wsInit, (state) => {
      state.wsError = '';
    })
    .addCase(allFeedWsActions.onOpen, (state) => {
      state.wsConnected = true;
      state.wsError = '';
    })
    .addCase(allFeedWsActions.onError, (state, action) => {
      state.wsError = action.payload;
    })
    .addCase(allFeedWsActions.onClose, (state) => {
      state.wsConnected = false;
      state.orders = [];
    })
    .addCase(allFeedWsActions.onMessage, (state, action) => {
      console.log(action.payload);
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
});
