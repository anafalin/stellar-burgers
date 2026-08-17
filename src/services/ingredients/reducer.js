import { FETCH_INGREDIENTS_ERROR, FETCH_INGREDIENTS_PENDING, FETCH_INGREDIENTS_SUCCESS } from './actions';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export function ingredientsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INGREDIENTS_PENDING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case FETCH_INGREDIENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload,
        error: null,
      };

    case FETCH_INGREDIENTS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
}
