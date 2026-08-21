import {
  RESET_PREVIEW_INGREDIENT,
  SET_PREVIEW_INGREDIENT,
  TPreviewIngredientActions,
} from './actions';
import { IPreviewIngredientState } from '../../utils/types';

const initialState: IPreviewIngredientState = {
  item: null,
};

export const previewIngredientReducer = (
  state: IPreviewIngredientState = initialState,
  action: TPreviewIngredientActions,
): IPreviewIngredientState => {
  switch (action.type) {
    case SET_PREVIEW_INGREDIENT:
      return {
        ...state,
        item: action.item,
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
