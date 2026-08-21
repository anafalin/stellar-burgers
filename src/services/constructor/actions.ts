import { IIngredient } from '../../utils/types';
import {
  IResetPreviewIngredientAction,
  ISetPreviewIngredientAction,
  RESET_PREVIEW_INGREDIENT,
  SET_PREVIEW_INGREDIENT,
} from '../preview-ingredient/actions';

export const ADD_BUN: 'ADD_BUN' = 'ADD_BUN';
export const ADD_INGREDIENT: 'ADD_INGREDIENT' = 'ADD_INGREDIENT';
export const DELETE_INGREDIENT: 'DELETE_INGREDIENT' = 'DELETE_INGREDIENT';
export const MOVE_INGREDIENT: 'MOVE_INGREDIENT' = 'MOVE_INGREDIENT';
export const RESET_CONSTRUCTOR_ITEMS: 'RESET_CONSTRUCTOR_ITEMS' = 'RESET_CONSTRUCTOR_ITEMS';

export interface IAddBunAction {
  readonly type: typeof ADD_BUN;
  readonly ingredient: IIngredient;
}

export interface IAddIngredientAction {
  readonly type: typeof ADD_INGREDIENT;
  readonly ingredient: IIngredient;
}

export interface IDeleteIngredientAction {
  readonly type: typeof DELETE_INGREDIENT;
  readonly index: string;
}

export interface IMoveIngredientAction {
  readonly type: typeof MOVE_INGREDIENT;
  readonly toIndex: number;
  readonly fromIndex: number;
}

export interface IResetConstructorItemsAction {
  readonly type: typeof RESET_CONSTRUCTOR_ITEMS;
}

export type TConstructorActions =
  | IAddBunAction
  | IAddIngredientAction
  | IDeleteIngredientAction
  | IMoveIngredientAction
  | IResetConstructorItemsAction;

export const addBun = (ingredient: IIngredient): IAddBunAction => ({
  type: ADD_BUN,
  ingredient: ingredient,
});

export const addIngredient = (ingredient: IIngredient): IAddIngredientAction => ({
  type: ADD_INGREDIENT,
  ingredient: ingredient,
});

export const deleteIngredient = (index: string): IDeleteIngredientAction => ({
  type: DELETE_INGREDIENT,
  index: index,
});

export const moveIngredient = (toIndex: number, fromIndex: number): IMoveIngredientAction => ({
  type: MOVE_INGREDIENT,
  toIndex: toIndex,
  fromIndex: fromIndex,
});

export const resetConstructorItems = (): IResetConstructorItemsAction => ({
  type: RESET_CONSTRUCTOR_ITEMS,
});