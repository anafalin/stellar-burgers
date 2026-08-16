import done from '../../image/done.svg';
import Modal from '../modal/Modal';
import style from './style.module.css';

const OrderDetails = (onCLose, order) => {
  return (
    <Modal title="Детали ингредиента" onClose={onCLose}>
      <div className={style.orderWrapper}>
        <div className={style.orderIdWrapper}>
          <p className={style.orderNumber}>{order.number}</p>
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
