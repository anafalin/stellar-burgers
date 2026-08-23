import style from './style.module.css';
import FeedItem from '../feed-item/FeedItem';
import { TFeedOrder } from '../../utils/types';
import { useSelector } from 'react-redux';
import { selectIngredientsItems } from '../../services/ingredients/selectors';

interface FeedItemListProps {
  orders: TFeedOrder[] | [];
}

const FeedItemList = ({ orders }: FeedItemListProps) => {
  const ingredientItems = useSelector(selectIngredientsItems);
  console.log(ingredientItems);

  // Собираем картинки в том порядке и количестве, в котором они лежат в заказе
  const getImages = (order: TFeedOrder) => {
    return order.ingredients
      .map((id) => ingredientItems.find((item) => item._id === id))
      .filter((ingredient): ingredient is NonNullable<typeof ingredient> => !!ingredient)
      .map((ingredient) => ingredient.image_mobile);
  };

  // Оптимальный и безопасный подсчет суммы за один проход reduce
  const getSum = (order: TFeedOrder) => {
    return order.ingredients.reduce((acc, id) => {
      // Ищем ингредиент в общем списке прямо внутри reduce
      const ingredient = ingredientItems.find((item) => item._id === id);

      // Если ингредиент найден — прибавляем цену, если нет (бэкенд прислал битый id) — возвращаем текущую сумму
      return ingredient ? acc + ingredient.price : acc;
    }, 0);
  };

  return (
    <div className={style.feedListWrapper}>
      <h2 className={style.title}>Лента заказов</h2>
      <div className={style.items}>
        {orders.map((order) => (
          <FeedItem
            key={order._id}
            sum={getSum(order)}
            id={order._id}
            created_at={order.createdAt}
            number={order.number}
            name={order.name}
            status={order.status}
            ingredients={getImages(order)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedItemList;
