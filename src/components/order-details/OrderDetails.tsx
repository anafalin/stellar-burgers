import done from '../../images/done.svg';
import style from './style.module.css';
import { useSelector } from 'react-redux';
import { orderIndex } from '../../services/order/selectors';

const OrderDetails = () => {
  const orderId = useSelector(orderIndex);

  if (!orderId) return <></>;

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
