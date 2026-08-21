import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { constructorReducer } from './constructor/reducer';
import { ingredientsReducer } from './ingredients/reducer';
import { previewIngredientReducer } from './preview-ingredient/reducer';
import { orderReducer } from './order/reducer';
import { IStore } from '../utils/types';

const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  ingredients: ingredientsReducer,
  previewIngredient: previewIngredientReducer,
  order: orderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const initialStore: Partial<RootState> = {
  ingredients: {
    items: [],
    isLoading: true,
    error: null,
  },
  burgerConstructor: {
    bun: null,
    ingredients: [],
  },
  previewIngredient: {
    item: null,
  },
  order: {
    orderId: null,
    ingredients: [],
    isLoading: false,
    error: null,
  },
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialStore as any,
});
