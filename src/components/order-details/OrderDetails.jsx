import done from '../../images/done.svg';
import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { orderIndex} from '../../services/order/selectors';
import Modal from '../modal/Modal';
import { RESET_CONSTRUCTOR_ITEMS } from '../../services/constructor/actions';
import { RESET_ORDER } from '../../services/order/actions';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const orderId = useSelector(orderIndex);

  const closeModalHandler = () => {
    dispatch({
      type: RESET_CONSTRUCTOR_ITEMS,
    });
    dispatch({
      type: RESET_ORDER,
    });
  };

  if (!orderId) return null;

  return (
    <Modal onClose={closeModalHandler}>
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
    </Modal>
  );
};

export default OrderDetails;
