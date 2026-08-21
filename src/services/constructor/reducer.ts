import {
  ADD_BUN,
  ADD_INGREDIENT,
  DELETE_INGREDIENT,
  MOVE_INGREDIENT,
  RESET_CONSTRUCTOR_ITEMS,
  TConstructorActions,
} from './actions';
import { IConstructorState } from '../../utils/types';

const initialState: IConstructorState = {
  bun: null,
  ingredients: [],
};

export function constructorReducer(
  state: IConstructorState = initialState,
  action: TConstructorActions,
): IConstructorState {
  switch (action.type) {
    case ADD_BUN:
      return {
        ...state,
        bun: action.ingredient,
      };

    case ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, { ...action.ingredient }],
      };

    case MOVE_INGREDIENT: {
      const updatedIngredients = [...state.ingredients];
      const [movedItem] = updatedIngredients.splice(action.fromIndex, 1);
      if (movedItem) {
        updatedIngredients.splice(action.toIndex, 0, movedItem);
      }
      return {
        ...state,
        ingredients: updatedIngredients,
      };
    }

    case DELETE_INGREDIENT: {
      return {
        ...state,
        ingredients: state.ingredients.filter((item) => item.uniqueId !== action.index),
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
