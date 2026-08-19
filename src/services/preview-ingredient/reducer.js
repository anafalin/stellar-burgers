import { RESET_PREVIEW_INGREDIENT, SET_PREVIEW_INGREDIENT } from './actions';

const initialState = {
  item: null,
};

export function previewIngredientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PREVIEW_INGREDIENT:
      return {
        ...state,
        item: action.payload,
      };

    case RESET_PREVIEW_INGREDIENT: {
      return {
        ...state,
        item: null,
      };
    }

    default:
      return { ...state };
  }
}
