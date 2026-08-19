import { IStore } from '../../utils/types';

export const ingredientsOrder = (store: IStore) => store.order.ingredients;
export const orderIndex = (store: IStore) => store.order.orderId;
export const orderLoading = (store: IStore) => store.order.isLoading;
export const orderError = (store: IStore) => store.order.error;
