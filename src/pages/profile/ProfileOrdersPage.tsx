import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services';
import { useEffect, useRef } from 'react';
import { userFeedWsClose, userFeedWsInit } from '../../services/user-feed/actions';
import { IStore } from '../../utils/types';
import FeedItemList from '../../components/feed-item-list/FeedItemList';


const ProfileOrdersPage = () => {
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return status;
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    dispatch(userFeedWsInit()); // Запускаем сокет

    return () => {
      isMountedRef.current = false;

      // Даем React 50 миллисекунд. Если это StrictMode — компонент мгновенно
      // смонтируется обратно, и isMountedRef.current снова станет true.
      // Если пользователь РЕАЛЬНО ушел со страницы — ref останется false, и мы закроем сокет.
      setTimeout(() => {
        if (!isMountedRef.current) {
          dispatch(userFeedWsClose());
        }
      }, 50);
    };
  }, [dispatch]);

  const { orders, total, totalToday, wsError } = useSelector((store: IStore) => store.userFeed);

  console.log(orders);
  if (wsError) {
    return <>Ошибка получения ленты заказов</>;
  }

  return (
    <div className={style.feedsWrapper}>
      <FeedItemList orders={orders} />
    </div>
  );
};

export default ProfileOrdersPage;
