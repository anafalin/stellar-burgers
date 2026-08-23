import { request } from '../utils/api';

export async function getIngredients() {
  // Просто вызываем request с нужным эндпоинтом
  return request('/ingredients');
}

export async function createOrderRequest(ingredients: string[]) {
  return await request('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
}
