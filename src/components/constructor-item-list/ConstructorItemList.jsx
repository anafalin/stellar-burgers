import ConstructorItem from '../constructor-item/ConstructorItem';
import style from './style.module.css';
import { useSelector } from 'react-redux';
import { bun, ingredients } from '../../services/constructor/selectors';
import ConstructorEmptyItemList from './ConstructorEmptyItemList';

const ConstructorItemList = () => {
  const bunItem = useSelector(bun);
  const ingredientItems = useSelector(ingredients);

  return (
    <div className={style.list}>
      <div className={style.item}>
        {bunItem == null ? (
          <ConstructorEmptyItemList placeholder={'Добавьте булку'} />
        ) : (
          <ConstructorItem
            type="top"
            isLocked={true}
            text={bunItem.name}
            price={bunItem.price}
            thumbnail={bunItem.image}
          />
        )}
      </div>

      <div className={style.ingredientList}>
        {ingredientItems.length === 0 ? (
          <ConstructorEmptyItemList placeholder={'Добавьте ингредиент'} />
        ) : (
          ingredientItems.map((item, index) => (
            <ConstructorItem key={index} text={item.name} price={item.price} thumbnail={item.image} />
          ))
        )}
      </div>

      <div className={style.item}>
        {bunItem == null ? (
          <ConstructorEmptyItemList placeholder={'Добавьте булку'} />
        ) : (
          <ConstructorItem
            type="bottom"
            isLocked={true}
            text={bunItem.name}
            price={bunItem.price}
            thumbnail={bunItem.image}
          />
        )}
      </div>
    </div>
  );
};

export default ConstructorItemList;
