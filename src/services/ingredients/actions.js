import { getIngredients } from '../../api/IngredientsApi';

export const FETCH_INGREDIENTS_PENDING = 'FETCH_INGREDIENTS_PENDING';
export const FETCH_INGREDIENTS_SUCCESS = 'FETCH_INGREDIENTS_SUCCESS';
export const FETCH_INGREDIENTS_ERROR = 'FETCH_INGREDIENTS_ERROR';

export function fetchIngredients() {
  return async (dispatch) => {
    dispatch({ type: FETCH_INGREDIENTS_PENDING });

    try {
      const response = await getIngredients();
      dispatch({
        type: FETCH_INGREDIENTS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_INGREDIENTS_ERROR,
        payload: error.message,
      });
    }
  };
}
