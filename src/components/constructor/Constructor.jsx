import ConstructorItemList from '../constructor-item-list/ConstructorItemList';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import style from './style.module.css';

const Constructor = () => {
  return (
    <div className={style.constructor}>
      <ConstructorItemList />
      <div className={style.order}>
        <div className={style.sum}>
          610 <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="medium">
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};

export default Constructor;
