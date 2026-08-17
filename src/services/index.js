import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { constructorReducer } from './constructor/reducer';
import { ingredientsReducer } from './ingredients/reducer';

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
};

const rootReducer = combineReducers({
  constructor: constructorReducer,
  ingredients: ingredientsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialStore,
});
