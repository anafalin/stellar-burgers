import {
  CREATE_ORDER,
  REQUEST_CREATE_ORDER_ERROR,
  REQUEST_CREATE_ORDER_PENDING,
  REQUEST_CREATE_ORDER_SUCCESS,
  RESET_ORDER,
  TOrderActions, // Импортируем наш union-тип
} from './actions';
import { IOrderState } from '../../utils/types';

const initialState: IOrderState = {
  orderId: null,
  ingredients: [],
  isLoading: false,
  error: null,
};

export const orderReducer = (
  state: IOrderState = initialState,
  action: TOrderActions,
): IOrderState => {
  switch (action.type) {
    case CREATE_ORDER: {
      return {
        ...state,
        ingredients: [...action.ingredients],
      };
    }

    case REQUEST_CREATE_ORDER_PENDING: {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }

    case REQUEST_CREATE_ORDER_SUCCESS: {
      console.log(action);
      return {
        ...state,
        isLoading: false,
        orderId: action.response.order.number,
      };
    }

    case REQUEST_CREATE_ORDER_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.message,
      };
    }

    case RESET_ORDER: {
      return {
        ...initialState,
      };
    }

    default: {
      return state;
    }
  }
};
