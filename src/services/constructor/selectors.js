import { createSelector } from '@reduxjs/toolkit';

export const bun = (store) => store.constructor.bun;
export const ingredients = (store) => store.constructor.ingredients;

export const ingredientById = (id) =>
  createSelector([bun, ingredients], (bunItem, ingredientItems) => {
    if (bunItem && bunItem._id === id) {
      return 2;
    }

    return ingredientItems?.filter((item) => item._id === id).length;
  });