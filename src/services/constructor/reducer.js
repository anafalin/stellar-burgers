import { ADD_BUN, ADD_INGREDIENT, DELETE_INGREDIENT } from './actions';

const initialState = {
  bun: null,
  ingredients: [],
};

export function constructorReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_BUN:
      return {
        ...state,
        bun: action.bun,
      };
    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredients],
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient) => ingredient.id !== action.ingredient.id),
      };
    default:
      return state;
  }
}
