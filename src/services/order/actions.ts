import { createOrderRequest } from '../../api/api';
import { Dispatch } from 'redux';

// Константы типов (используем as const для автоматического вывода литерального типа)
export const REQUEST_CREATE_ORDER_PENDING = 'REQUEST_CREATE_ORDER_PENDING' as const;
export const REQUEST_CREATE_ORDER_SUCCESS = 'REQUEST_CREATE_ORDER_SUCCESS' as const;
export const REQUEST_CREATE_ORDER_ERROR = 'REQUEST_CREATE_ORDER_ERROR' as const;

export interface IRequestCreateOrderPendingAction {
  readonly type: typeof REQUEST_CREATE_ORDER_PENDING;
}

export interface IRequestCreateOrderSuccessAction {
  readonly type: typeof REQUEST_CREATE_ORDER_SUCCESS;
  readonly payload: string;
}

export interface IRequestCreateOrderErrorAction {
  readonly type: typeof REQUEST_CREATE_ORDER_ERROR;
  readonly message: string;
}

export type TOrderActions =
  IRequestCreateOrderPendingAction | IRequestCreateOrderSuccessAction | IRequestCreateOrderErrorAction;

// Синхронные генераторы экшенов (Action Creators) для порядка
export const createOrderPending = (): IRequestCreateOrderPendingAction => ({
  type: REQUEST_CREATE_ORDER_PENDING,
});

export const createOrderSuccess = (payload: string): IRequestCreateOrderSuccessAction => ({
  type: REQUEST_CREATE_ORDER_SUCCESS,
  payload: payload,
});

export const createOrderError = (error: string): IRequestCreateOrderErrorAction => ({
  type: REQUEST_CREATE_ORDER_ERROR,
  message: error,
});

export function createOrder(ingredients: string[]) {
  return async (dispatch: Dispatch<TOrderActions>) => {
    dispatch(createOrderPending());

    try {
      const response = await createOrderRequest(ingredients);
      dispatch(createOrderSuccess(response));
    } catch (error: any) {
      dispatch(createOrderError(error.message || 'Что-то пошло не так'));
    }
  };
}
