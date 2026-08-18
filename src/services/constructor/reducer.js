import { ADD_BUN, ADD_INGREDIENT, DELETE_INGREDIENT, MOVE_INGREDIENT, RESET_CONSTRUCTOR_ITEMS } from './actions';

const initialState = {
  bun: null,
  ingredients: [],
};

export function constructorReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BUN:
      return {
        ...state,
        bun: action.payload,
      };

    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, { ...action.payload }],
      };

    case MOVE_INGREDIENT: {
      const ingredients = [...state.ingredients];
      ingredients.splice(action.payload.toIndex, 0, ingredients.splice(action.payload.fromIndex, 1)[0]);
      return {
        ...state,
        ingredients: ingredients,
      };
    }

    case DELETE_INGREDIENT: {
      const ingredients = [...state.ingredients];
      ingredients.filter(item => item.uniqueId !== action.payload)
      return {
        ...state,
        ingredients: ingredients,
      };
    }

    case RESET_CONSTRUCTOR_ITEMS: {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
}