import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { constructorReducer } from './constructor/reducer';
import { ingredientsReducer } from './ingredients/reducer';
import { previewIngredientReducer } from './preview-ingredient/reducer';
import { orderReducer } from './order/reducer';
import { socketMiddleware } from './middlewares/ws-middleware';
import { WS_BASE_URL } from '../api/constants';
import { allFeedWsActions } from './all-feed/actions';
import { userFeedWsActions } from './user-feed/actions';
import { userFeedReducer } from './user-feed/reducer';
import { allFeedReducer } from './all-feed/reducer';

const allFeedWsMiddleware = socketMiddleware(`${WS_BASE_URL}/orders/all`, allFeedWsActions);
const userFeedWsMiddleware = socketMiddleware(`${WS_BASE_URL}/orders`, userFeedWsActions);

const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  ingredients: ingredientsReducer,
  previewIngredient: previewIngredientReducer,
  order: orderReducer,
  userFeed: userFeedReducer,
  allFeed: allFeedReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем проверки сериализуемости для WebSocket событий и ошибок,
        // так как они содержат функции и сложные объекты
        ignoredActions: ['WS_CONNECTION_SUCCESS', 'WS_CONNECTION_ERROR', 'WS_CONNECTION_CLOSED', 'WS_GET_MESSAGE'],
        ignoredPaths: ['ws.error', 'ws.messages'],
      },
    })
      .concat(allFeedWsMiddleware)
      .concat(userFeedWsMiddleware), // Добавляем наше WS middleware
});
