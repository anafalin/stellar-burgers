import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import style from './style.module.css';
import ConstructorItem from '../constructor-item/ConstructorItem';
import ConstructorEmptyItemList from './ConstructorEmptyItemList';
import { addBun, addIngredient } from '../../services/constructor/actions';
import { IIngredient } from '../../utils/types';
import { selectBun, selectIngredients } from '../../services/constructor/selectors';
import { AppDispatch } from '../../services';

const ConstructorItemList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const bunItem = useSelector(selectBun);
  const ingredientItems = useSelector(selectIngredients);

  const topBunRef = useRef<HTMLDivElement>(null);
  const ingredientListRef = useRef<HTMLDivElement>(null);
  const bottomBunRef = useRef<HTMLDivElement>(null);

  const [{ isOverTopBun }, dropTopBunRef] = useDrop<IIngredient, void, { isOverTopBun: boolean }>({
    accept: 'bun',
    drop: (item: IIngredient) => {
      dispatch(addBun(item));
    },
    collect: (monitor) => ({
      isOverTopBun: monitor.isOver(),
    }),
  });

  const [{ isOverIngredient }, dropIngredientRef] = useDrop<IIngredient, void, { isOverIngredient: boolean }>({
    accept: 'ingredient',
    drop: (item: IIngredient) => {
      dispatch(addIngredient({ ...item, uniqueId: crypto.randomUUID() }));
    },
    collect: (monitor) => ({
      isOverIngredient: monitor.isOver(),
    }),
  });

  const [{ isOverBottomBun }, dropBottomBunRef] = useDrop<IIngredient, void, { isOverBottomBun: boolean }>({
    accept: 'bun',
    drop: (item: IIngredient) => {
      dispatch(addBun(item));
    },
    collect: (monitor) => ({
      isOverBottomBun: monitor.isOver(),
    }),
  });

  // Связываем dnd-дропзоны с нашими HTML-рефами
  dropTopBunRef(topBunRef);
  dropBottomBunRef(bottomBunRef);
  dropIngredientRef(ingredientListRef);

  return (
    <div className={style.list}>
      <div className={style.item} ref={topBunRef}>
        {bunItem == null ? (
          <ConstructorEmptyItemList placeholder={'Добавьте булку'} isOver={isOverTopBun || isOverBottomBun} />
        ) : (
          <ConstructorItem type="top" isLocked={true} item={bunItem} index={0} />
        )}
      </div>

      <div className={style.ingredientList} ref={ingredientListRef}>
        {ingredientItems.length === 0 ? (
          <ConstructorEmptyItemList placeholder={'Добавьте ингредиент'} isOver={isOverIngredient} />
        ) : (
          ingredientItems.map((item, index) => (
            <ConstructorItem key={item.uniqueId} index={index} item={item} isLocked={false} />
          ))
        )}
      </div>

      <div className={style.item} ref={bottomBunRef}>
        {bunItem == null ? (
          <ConstructorEmptyItemList placeholder={'Добавьте булку'} isOver={isOverTopBun || isOverBottomBun} />
        ) : (
          <ConstructorItem type="bottom" isLocked={true} item={bunItem} index={0} />
        )}
      </div>
    </div>
  );
};

export default ConstructorItemList;
