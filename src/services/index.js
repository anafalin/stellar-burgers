import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { constructorReducer } from './constructor/reducer';
import { ingredientsReducer } from './ingredients/reducer';
import { previewIngredientReducer } from './preview-ingredient/reducer';
import { orderReducer } from './order/reducer';

const initialStore = {
  ingredients: {
    items: [],
    isLoading: true,
    error: null,
  },
  constructor: {
    bun: null,
    ingredients: [],
  },
  previewIngredient: {
    item: null,
  },
  order: {
    orderId: '',
    ingredients: [],
    isLoading: false,
    error: null,
  },
};

const rootReducer = combineReducers({
  constructor: constructorReducer,
  ingredients: ingredientsReducer,
  previewIngredient: previewIngredientReducer,
  order: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialStore,
});
