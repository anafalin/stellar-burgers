export interface IIngredient {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
  uniqueId?: string;
}

export interface IIngredientsState {
  items: IIngredient[];
  isLoading: boolean;
  error: string | null;
}

export interface IConstructorState {
  bun: IIngredient | null;
  ingredients: IIngredient[];
}

export interface IPreviewIngredientState {
  item?: IIngredient | null;
}

export interface IOrderState {
  orderId: string | null;
  ingredients: string[];
  isLoading: boolean;
  error: string | null;
}

export interface IUserFeedState {
  wsError: string | null;
  wsConnected: boolean;
  orders: TFeedOrder[] | [];
  total: number;
  totalToday: number;
}

export interface IAllFeedState {
  wsError: string;
  wsConnected: boolean;
  orders: TFeedOrder[] | [];
  total: number;
  totalToday: number;
}

export interface IStore {
  ingredients: IIngredientsState;
  burgerConstructor: IConstructorState;
  previewIngredient: IPreviewIngredientState;
  order: IOrderState;
  allFeed: IAllFeedState;
  userFeed: IUserFeedState;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export type TFeedOrderStatus = 'done' | 'pending' | 'created';

export type TFeedOrder = {
  name: string;
  ingredients: string[];
  _id: string;
  status: TFeedOrderStatus;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type TFeedResponse = {
  success: boolean;
  orders: TFeedOrder[];
  total: number;
  totalToday: number;
};
