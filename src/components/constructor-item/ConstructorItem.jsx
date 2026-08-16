import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import style from './style.module.css';

const ConstructorItem = ({ type, isLocked, text, price, thumbnail }) => {
  return (
    <div className={style.itemCard}>
      {!isLocked && <DragIcon type="primary" />}
      <ConstructorElement
        type={type}
        isLocked={isLocked}
        text={text}
        price={price}
        thumbnail={thumbnail}
        extraClass={style.element}
      />
    </div>
  );
};

export default ConstructorItem;
