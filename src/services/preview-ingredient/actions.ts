// Константы типов
import { IIngredient } from '../../utils/types';

export const SET_PREVIEW_INGREDIENT: 'SET_PREVIEW_INGREDIENT' = 'SET_PREVIEW_INGREDIENT';
export const RESET_PREVIEW_INGREDIENT: 'RESET_PREVIEW_INGREDIENT' = 'RESET_PREVIEW_INGREDIENT';

// Интерфейсы экшенов
export interface ISetPreviewIngredientAction {
  readonly type: typeof SET_PREVIEW_INGREDIENT;
  readonly item: IIngredient;
}

export interface IResetPreviewIngredientAction {
  readonly type: typeof RESET_PREVIEW_INGREDIENT;
}

// Union-тип: Объединение всех интерфейсов экшенов в один тип через union (|). Это позволит редьюсеру знать обо всех возможных действиях.
export type TPreviewIngredientActions = ISetPreviewIngredientAction | IResetPreviewIngredientAction;

// Генераторы экшенов: Типизация возвращаемого значения функций-генераторов.
export const setPreviewIngredient = (item: IIngredient): ISetPreviewIngredientAction => ({
  type: SET_PREVIEW_INGREDIENT,
  item: item,
});

export const resetPreviewIngredient = (item: IIngredient): IResetPreviewIngredientAction => ({
  type: RESET_PREVIEW_INGREDIENT,
});