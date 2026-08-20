import { createOrderRequest } from '../../api/api';

export const CREATE_ORDER = 'CREATE_ORDER';
export const REQUEST_CREATE_ORDER_PENDING = 'REQUEST_CREATE_ORDER_PENDING';
export const REQUEST_CREATE_ORDER_SUCCESS = 'REQUEST_CREATE_ORDER_SUCCESS';
export const REQUEST_CREATE_ORDER_ERROR = 'REQUEST_CREATE_ORDER_ERROR';
export const RESET_ORDER = 'RESET_ORDER';

export const createOrder = (ingredients: string[]) => {
  return async (dispatch: any) => {
    dispatch({ type: REQUEST_CREATE_ORDER_PENDING });

    try {
      const res = await createOrderRequest(ingredients);
      dispatch({
        type: REQUEST_CREATE_ORDER_SUCCESS,
        payload: res,
      });
    } catch (error: any) {
      dispatch({
        type: REQUEST_CREATE_ORDER_ERROR,
        payload: error.message,
      });
    }
  };
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};