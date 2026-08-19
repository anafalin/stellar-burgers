import { createSelector } from '@reduxjs/toolkit';
import { IIngredient, IStore } from '../../utils/types';

export const bun = (store: IStore) => store.constructor.bun;
export const ingredients = (store: IStore) => store.constructor.ingredients;

export const ingredientById = (id: string) =>
  createSelector([bun, ingredients], (bunItem, ingredientItems) => {
    if (bunItem && bunItem._id === id) {
      return 2;
    }

    return ingredientItems?.filter((item:IIngredient) => item._id === id).length;
  });