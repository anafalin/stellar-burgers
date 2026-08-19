import {
  CREATE_ORDER,
  REQUEST_CREATE_ORDER_ERROR,
  REQUEST_CREATE_ORDER_PENDING,
  REQUEST_CREATE_ORDER_SUCCESS,
  RESET_ORDER,
} from './actions';
import { IOrderState } from '../../utils/types';

const initialState: IOrderState = {
  orderId: '',
  ingredients: [],
  isLoading: false,
  error: null,
};

export const orderReducer = (state: IOrderState = initialState, action: any) => {
  switch (action.type) {
    case CREATE_ORDER: {
      return {
        ...state,
        ingredients: [...action.payload.ingredients],
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
      return {
        ...state,
        isLoading: false,
        orderId: action.payload,
      };
    }

    case REQUEST_CREATE_ORDER_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    }

    case RESET_ORDER: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};
