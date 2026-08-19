import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ConstructorItemList from '../constructor-item-list/ConstructorItemList';
import OrderDetails from '../order-details/OrderDetails';
import Modal from '../modal/Modal';
import style from './style.module.css';
import { bun, ingredients } from '../../services/constructor/selectors';
import { CREATE_ORDER, createOrder, RESET_ORDER } from '../../services/order/actions';
import { orderIndex } from '../../services/order/selectors';
import { RESET_CONSTRUCTOR_ITEMS } from '../../services/constructor/actions';
import { useAuth } from '../../utils/auth';
import { IIngredient, IStore } from '../../utils/types';

const Constructor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { user } = useAuth();

  // Селекторы вытаскивают типизированные данные
  const bunItem = useSelector((state: IStore) => bun(state)) as IIngredient | null;
  const ingredientItems = useSelector((state: IStore) => ingredients(state)) as IIngredient[];
  const orderId = useSelector((state: IStore) => orderIndex(state)) as string | null;

  const clickCreateOrderHandler = (): void => {
    if (!bunItem || ingredientItems.length === 0) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    // Собираем массив ID: булка (верх) + ингредиенты + булка (низ)
    const list: string[] = [bunItem._id, ...ingredientItems.map((item) => item._id), bunItem._id];

    dispatch({
      type: CREATE_ORDER,
      payload: {
        ingredients: [...list],
      },
    });

    dispatch(createOrder(list));
  };

  const closeModalHandler = (): void => {
    dispatch({
      type: RESET_CONSTRUCTOR_ITEMS,
    });
    dispatch({
      type: RESET_ORDER,
    });
  };

  // Мемоизация вычисления суммы конструктора
  const total = useMemo<number>(() => {
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
    <div className={style.constructorWrapper}>
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
