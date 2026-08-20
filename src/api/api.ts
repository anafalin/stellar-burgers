// services/api/ingredients.js (или где у вас лежат эти функции)

import { request } from "../utils/api";
import { sleep } from '../services/order/actions';

export async function getIngredients() {
  // Просто вызываем request с нужным эндпоинтом
  return request('/ingredients');
}

export async function createOrderRequest(ingredients: string[]) {
  // Передаем метод, заголовки и тело запроса
  await sleep(6000);

  const data = await request('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });

  console.log(data);
  // Возвращаем только то, что нужно компоненту/редюсеру
  return data.order.number;
}