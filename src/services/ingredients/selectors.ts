import { createSelector } from '@reduxjs/toolkit';
import { IIngredient, IStore } from '../../utils/types';

export const selectIngredientsItems = (store: IStore): IIngredient[] => store.ingredients?.items || [];

export const selectSauceIngredients = createSelector(
  [selectIngredientsItems],
  (items: IIngredient[]) => items.filter((item) => item.type === 'sauce'),
);

export const selectMainIngredients = createSelector(
  [selectIngredientsItems],
  (items: IIngredient[]) => items.filter((item) => item.type === 'main'),
);

export const selectBunIngredients = createSelector(
  [selectIngredientsItems],
  (items: IIngredient[]) => items.filter((item) => item.type === 'bun'),
);
