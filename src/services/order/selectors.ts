import { IStore } from '../../utils/types';

export const order = (state: IStore) => state.order;
export const selectOrderIndex = (state: IStore): string | null => state.order.orderId;

export const selectOrderLoading = (state: IStore): boolean => state.order.isLoading;

export const selectOrderError = (state: IStore): string | null => state.order.error;