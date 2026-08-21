import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ConstructorItemList from '../constructor-item-list/ConstructorItemList';
import OrderDetails from '../order-details/OrderDetails';
import Modal from '../modal/Modal';
import style from './style.module.css';
import { createOrder, resetOrder } from '../../services/order/actions';
import { resetConstructorItems } from '../../services/constructor/actions';
import { useAuth } from '../../utils/auth';
import { selectBun, selectIngredients } from '../../services/constructor/selectors';
import { AppDispatch } from '../../services';

const Constructor: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const bunItem = useSelector(selectBun);
  const ingredientItems = useSelector(selectIngredients);

  const clickCreateOrderHandler = (): void => {
    if (!bunItem || ingredientItems.length === 0) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    const list: string[] = [bunItem._id, ...ingredientItems.map((item) => item._id), bunItem._id];

    dispatch(createOrder(list));
    setIsModalOpen(true);
  };

  const closeModalHandler = (): void => {
    dispatch(resetConstructorItems());
    dispatch(resetOrder());
    setIsModalOpen(false);
  };

  const total = useMemo<number>(() => {
    let sum = 0;
    if (bunItem) {
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

      {isModalOpen && (
        <Modal onClose={closeModalHandler}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default Constructor;
