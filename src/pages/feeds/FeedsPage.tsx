import style from './style.module.css';
import FeedItemList from '../../components/feed-item-list/FeedItemList';
import FeedResult from '../../components/feed-result/FeedResult';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useRef } from 'react';
import { allFeedWsClose, allFeedWsInit } from '../../services/all-feed/actions';
import { IStore } from '../../utils/types';
import { AppDispatch } from '../../services';
import { fetchIngredients } from '../../services/ingredients/actions';

const FeedsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    dispatch(fetchIngredients());
    dispatch(allFeedWsInit()); // Запускаем сокет

    return () => {
      isMountedRef.current = false;

      // Даем React 50 миллисекунд. Если это StrictMode — компонент мгновенно
      // смонтируется обратно, и isMountedRef.current снова станет true.
      // Если пользователь РЕАЛЬНО ушел со страницы — ref останется false, и мы закроем сокет.
      setTimeout(() => {
        if (!isMountedRef.current) {
          dispatch(allFeedWsClose());
        }
      }, 50);
    };
  }, [dispatch]);

  const { orders, total, totalToday, wsError } = useSelector((store: IStore) => store.allFeed);

  const doneOrderNumbers = useMemo(() => {
    return orders
      .filter((order) => order.status === 'done')
      .map((order) => order.number)
      .slice(0, 15);
  }, [orders]);

  const pendingOrderNumbers = useMemo(() => {
    return orders
      .filter((order) => order.status === 'pending')
      .map((order) => order.number)
      .slice(0, 15);
  }, [orders]);

  console.log(orders);
  if (wsError) {
    return <>Ошибка получения ленты заказов</>;
  }

  return (
    <div className={style.feedsWrapper}>
      <FeedItemList orders={orders} />
      <FeedResult
        totalToday={totalToday}
        total={total}
        pendingOrders={pendingOrderNumbers}
        doneOrders={doneOrderNumbers}
      />
    </div>
  );
};

export default FeedsPage;
