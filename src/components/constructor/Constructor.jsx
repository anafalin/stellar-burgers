import ConstructorItemList from '../constructor-item-list/ConstructorItemList';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { bun, ingredients } from '../../services/constructor/selectors';
import { useMemo } from 'react';
import { CREATE_ORDER, createOrder, RESET_ORDER } from '../../services/order/actions';
import { orderIndex } from '../../services/order/selectors';
import OrderDetails from '../order-details/OrderDetails';
import Modal from '../modal/Modal';
import { RESET_CONSTRUCTOR_ITEMS } from '../../services/constructor/actions';
import { useAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const Constructor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const bunItem = useSelector(bun);
  const ingredientItems = useSelector(ingredients);
  const orderId = useSelector(orderIndex);

  const clickCreateOrderHandler = () => {
    if (!bunItem || ingredientItems.length === 0) {
      return;
    }

    if(!user) {
      navigate('/login')
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

  const closeModalHandler = () => {
    dispatch({
      type: RESET_CONSTRUCTOR_ITEMS,
    });
    dispatch({
      type: RESET_ORDER,
    });
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
      </div>

      {orderId && (
        <Modal onClose={closeModalHandler}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default Constructor;
