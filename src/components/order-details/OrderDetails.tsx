import done from '../../images/done.svg';
import style from './style.module.css';
import { useSelector } from 'react-redux';
import { orderIndex, orderLoading } from '../../services/order/selectors';

const OrderDetails = () => {
  const orderId = useSelector(orderIndex);
  const orderIsLoader = useSelector(orderLoading);

  if (orderIsLoader) {
    return (
      <div className={style.orderWrapper}>
        <div className={style.spinnerWrapper}>
          <div className={style.spinner}></div>
          <p className={style.loadingText}>Заказ формируется...</p>
        </div>
      </div>
    );
  }

  // 2. Если загрузка завершилась, но ID почему-то нет (например, ошибка)
  if (!orderId) return null;

  return (
      <div className={style.orderWrapper}>
        <div className={style.orderIdWrapper}>
          <p className={style.orderNumber}>{orderId}</p>
          <p>идентификатор заказа</p>
        </div>

        <div className={style.imgWrapper}>
          <img src={done} alt="Заказ оформлен" />
        </div>

        <div className={style.addonTextWrapper}>
          <p className={style.addonTitle}>Ваш заказ начали готовить</p>
          <p className={style.addonSubtitle}>Дождитесь готовности на орбитальной станции</p>
        </div>
      </div>
  );
};

export default OrderDetails;
