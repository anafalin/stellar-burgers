import { createSelector } from '@reduxjs/toolkit';
import { IIngredient, IStore } from '../../utils/types';

export const selectBun = (store: IStore): IIngredient | null => store.burgerConstructor.bun;

export const selectIngredients = (store: IStore): IIngredient[] =>
  store.burgerConstructor.ingredients;

export const selectCountIngredientById = (id: string) =>
  createSelector(
    [selectBun, selectIngredients],
    (bunItem: IIngredient | null, ingredientItems: IIngredient[]) => {
      if (bunItem && bunItem._id === id) {
        return 2;
      }
      return ingredientItems?.filter((item: IIngredient) => item._id === id).length ?? 0;
    },
  );
