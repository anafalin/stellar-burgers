import { RESET_PREVIEW_INGREDIENT, SET_PREVIEW_INGREDIENT } from './actions';
import { IPreviewIngredientState } from '../../utils/types';

const initialState: IPreviewIngredientState = {
  item: null,
};

export const previewIngredientReducer = (
  state: IPreviewIngredientState = initialState,
  action: any,
) => {
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
};
