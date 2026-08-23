import {
  REQUEST_CREATE_ORDER_ERROR,
  REQUEST_CREATE_ORDER_PENDING,
  REQUEST_CREATE_ORDER_SUCCESS,
  TOrderActions,
} from './actions';
import { IOrderState } from '../../utils/types';

const initialState: IOrderState = {
  orderId: null,
  ingredients: [],
  isLoading: false,
  error: null,
};

export const orderReducer = (state: IOrderState = initialState, action: TOrderActions): IOrderState => {
  switch (action.type) {
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
        orderId: action.payload,
      };
    }

    case REQUEST_CREATE_ORDER_ERROR: {
      return {
        ...state,
        isLoading: false,
        error: action.message,
      };
    }

    default: {
      return state;
    }
  }
};
