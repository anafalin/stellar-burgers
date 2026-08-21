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
  orderId: number | null;
  ingredients: string[];
  isLoading: boolean;
  error: string | null;
}

export interface IStore {
  ingredients: IIngredientsState;
  burgerConstructor: IConstructorState;
  previewIngredient: IPreviewIngredientState;
  order: IOrderState;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}
