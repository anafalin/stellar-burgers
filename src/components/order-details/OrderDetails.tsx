import done from '../../images/done.svg';
import style from './style.module.css';
import { useSelector } from 'react-redux';
import { order, selectOrderError, selectOrderIndex, selectOrderLoading } from '../../services/order/selectors';
import LoadingComponent from '../loading-component/LoadingComponent';
import ErrorComponent from '../error-component/ErrorComponent';

const OrderDetails = () => {
  const orderdata = useSelector(order);
  const orderId = useSelector(selectOrderIndex);
  const orderIsLoader = useSelector(selectOrderLoading);
  const oOrderError = useSelector(selectOrderError);

  if (orderIsLoader && !orderId) {
    return <LoadingComponent text={'Оформляем заказ..'} />;
  }
  if (oOrderError) return <ErrorComponent text={'Ошибка при формировании заказа'} />;

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
