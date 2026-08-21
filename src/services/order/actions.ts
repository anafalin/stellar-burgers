import { createOrderRequest } from '../../api/api';

type IOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

// Константы типов (используем as const для автоматического вывода литерального типа)
export const CREATE_ORDER = 'CREATE_ORDER' as const;
export const REQUEST_CREATE_ORDER_PENDING = 'REQUEST_CREATE_ORDER_PENDING' as const;
export const REQUEST_CREATE_ORDER_SUCCESS = 'REQUEST_CREATE_ORDER_SUCCESS' as const;
export const REQUEST_CREATE_ORDER_ERROR = 'REQUEST_CREATE_ORDER_ERROR' as const;
export const RESET_ORDER = 'RESET_ORDER' as const;

// Интерфейсы экшенов с правильными полями
export interface ICreateOrderAction {
  readonly type: typeof CREATE_ORDER;
  readonly ingredients: ReadonlyArray<string>;
}

export interface IRequestCreateOrderPendingAction {
  readonly type: typeof REQUEST_CREATE_ORDER_PENDING;
}

export interface IRequestCreateOrderSuccessAction {
  readonly type: typeof REQUEST_CREATE_ORDER_SUCCESS;
  readonly response: IOrderResponse;
}

export interface IRequestCreateOrderErrorAction {
  readonly type: typeof REQUEST_CREATE_ORDER_ERROR;
  readonly message: string;
}

export interface IResetOrderAction {
  readonly type: typeof RESET_ORDER;
}

export type TOrderActions =
  | ICreateOrderAction
  | IRequestCreateOrderPendingAction
  | IRequestCreateOrderSuccessAction
  | IRequestCreateOrderErrorAction
  | IResetOrderAction;

// Синхронные генераторы экшенов (Action Creators) для порядка
export const createOrderPending = (): IRequestCreateOrderPendingAction => ({
  type: REQUEST_CREATE_ORDER_PENDING,
});

export const createOrderSuccess = (response: IOrderResponse): IRequestCreateOrderSuccessAction => ({
  type: REQUEST_CREATE_ORDER_SUCCESS,
  response,
});

export const createOrderError = (error: string): IRequestCreateOrderErrorAction => ({
  type: REQUEST_CREATE_ORDER_ERROR,
  message: error,
});

export const resetOrder = (): IResetOrderAction => ({
  type: RESET_ORDER,
});

// Асинхронный thunk-экшен с чистой типизацией dispatch
export const createOrder = (ingredients: string[]) => {
  return async (dispatch: (action: TOrderActions) => void) => {
    dispatch(createOrderPending());

    try {
      const res = await createOrderRequest(ingredients);
      dispatch(createOrderSuccess(res));
    } catch (error: any) {
      dispatch(createOrderError(error.message || 'Что-то пошло не так'));
    }
  };
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};