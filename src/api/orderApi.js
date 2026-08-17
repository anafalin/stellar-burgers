import { BASE_URL } from './constants';

export async function createOrderRequest(ingredients) {
  console.log(ingredients);

  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data.order.number;
  } catch (error) {
    throw new Error('Ошибка при получении ингредиентов:', error);
  }
}
