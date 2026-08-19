import { createSelector } from '@reduxjs/toolkit';
import { IStore } from '../../utils/types';

const selectIngredientsItems = (store:IStore) => store.ingredients?.items || [];

export const sauceIngredients = createSelector([selectIngredientsItems], (items) =>
  items.filter((item) => item.type === 'sauce'),
);

export const mainIngredients = createSelector([selectIngredientsItems], (items) =>
  items.filter((item) => item.type === 'main'),
);

export const bunIngredients = createSelector([selectIngredientsItems], (items) =>
  items.filter((item) => item.type === 'bun'),
);
