import { BASE_URL } from './constants';

export async function fetchGetIngredients() {
  try {
    const response = await fetch(`${BASE_URL}/ingredients`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()).data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Fetch error:', message);
    return [];
  }
}
