import { Dispatch } from 'redux';
import { getIngredients } from '../../api/api';
import { IIngredient } from '../../utils/types';

export const FETCH_INGREDIENTS_PENDING = 'FETCH_INGREDIENTS_PENDING' as const;
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS' as const;
export const FETCH_INGREDIENTS_ERROR = 'FETCH_INGREDIENTS_ERROR' as const;

export interface IFetchedIngredientsPendingAction {
  readonly type: typeof FETCH_INGREDIENTS_PENDING;
}

export interface IFetchedIngredientsSuccessAction {
  readonly type: typeof FETCH_INGREDIENTS_SUCCESS;
  readonly items: IIngredient[];
}

export interface IFetchedIngredientsErrorAction {
  readonly type: typeof FETCH_INGREDIENTS_ERROR;
  readonly message: string;
}

export type TIngredientActions =
  | IFetchedIngredientsPendingAction
  | IFetchedIngredientsSuccessAction
  | IFetchedIngredientsErrorAction;

export const fetchedIngredientsPending = (): IFetchedIngredientsPendingAction => ({
  type: FETCH_INGREDIENTS_PENDING,
});

export const fetchedIngredientsSuccess = (
  items: IIngredient[],
): IFetchedIngredientsSuccessAction => ({
  type: FETCH_INGREDIENTS_SUCCESS,
  items: items,
});

export const fetchedIngredientsError = (message: string): IFetchedIngredientsErrorAction => ({
  type: FETCH_INGREDIENTS_ERROR,
  message: message,
});

export function fetchIngredients() {
  return async (dispatch: Dispatch<TIngredientActions>) => {
    dispatch({ type: FETCH_INGREDIENTS_PENDING });

    try {
      const response = await getIngredients();
      dispatch(fetchedIngredientsSuccess(response.data));
    } catch (error: any) {
      dispatch(fetchedIngredientsError(error.message || 'Что-то пошло не так'));
    }
  };
}
