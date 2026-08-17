import ConstructorItemList from '../constructor-item-list/ConstructorItemList';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { bun, ingredients } from '../../services/constructor/selectors';
import { useMemo } from 'react';
import { CREATE_ORDER, createOrder } from '../../services/order/actions';
import { orderIndex } from '../../services/order/selectors';
import OrderDetails from '../order-details/OrderDetails';

const Constructor = () => {
  const dispatch = useDispatch();
  const bunItem = useSelector(bun);
  const ingredientItems = useSelector(ingredients);
  const orderId = useSelector(orderIndex);

  const clickCreateOrderHandler = () => {
    if (!bunItem || ingredientItems.length === 0) {
      return;
    }

    const list = [bunItem._id, ...ingredientItems.map((item) => item._id), bunItem._id];

    dispatch({
      type: CREATE_ORDER,
      payload: {
        ingredients: [...list],
      },
    });

    dispatch(createOrder(list));
  };

  // Мемоизация вычисления суммы конструктора
  const total = useMemo(() => {
    let sum = 0;
    if (bunItem !== null) {
      sum = sum + bunItem.price * 2;
    }
    ingredientItems?.forEach((ingredient) => {
      sum = sum + ingredient.price;
    });
    return sum;
  }, [bunItem, ingredientItems]);

  return (
    <div className={style.constructor}>
      <ConstructorItemList />

      <div className={style.order}>
        <div className={style.sum}>
          {total} <CurrencyIcon type="primary" />
        </div>

        <Button htmlType="button" type="primary" size="medium" onClick={clickCreateOrderHandler}>
          Оформить заказ
        </Button>

        <>{orderId && <OrderDetails />}</>
      </div>
    </div>
  );
};

export default Constructor;
