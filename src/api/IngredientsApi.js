import { BASE_URL } from './constants';

export async function getIngredients() {
  try {
    const response = await fetch(`${BASE_URL}/ingredients`);

    return await response.json();
  } catch (error) {
    throw new Error('Ошибка при получении ингредиентов:', error);
  }
}
