import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import style from './style.module.css';

import ConstructorItem from '../constructor-item/ConstructorItem';
import ConstructorEmptyItemList from './ConstructorEmptyItemList';
import { bun, ingredients } from '../../services/constructor/selectors';
import { ADD_BUN, ADD_INGREDIENT } from '../../services/constructor/actions';
import { IIngredient, IStore } from '../../utils/types';

// Заглушка для useDispatch (если у вас настроен AppDispatch, замените тип)
type AppDispatch = any;

const ConstructorItemList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Селекторы вытаскивают строго типизированные данные
  const bunItem = useSelector((state: IStore) => bun(state)) as IIngredient | null;
  const ingredientItems = useSelector((state: IStore) =>
    ingredients(state),
  ) as IIngredient[];

  // Указываем точные типы HTMLDivElement для хуков dnd и рефов
  const topBunRef = useRef<HTMLDivElement>(null);
  const ingredientListRef = useRef<HTMLDivElement>(null);
  const bottomBunRef = useRef<HTMLDivElement>(null);

  // useDrop<ТипВходящегоИтема, ТипВозвращаемогоЗначения, ТипСобранныхДанных>
  const [{ isOverTopBun }, dropTopBunRef] = useDrop<IIngredient, void, { isOverTopBun: boolean }>({
    accept: 'bun',
    drop: (item: IIngredient) => {
      dispatch({ type: ADD_BUN, payload: item });
    },
    collect: (monitor) => ({
      isOverTopBun: monitor.isOver(),
    }),
  });

  const [{ isOverIngredient }, dropIngredientRef] = useDrop<
    IIngredient,
    void,
    { isOverIngredient: boolean }
  >({
    accept: 'ingredient',
    drop: (item: IIngredient) => {
      dispatch({
        type: ADD_INGREDIENT,
        payload: { ...item, uniqueId: crypto.randomUUID() },
      });
    },
    collect: (monitor) => ({
      isOverIngredient: monitor.isOver(),
    }),
  });

  const [{ isOverBottomBun }, dropBottomBunRef] = useDrop<
    IIngredient,
    void,
    { isOverBottomBun: boolean }
  >({
    accept: 'bun',
    drop: (item: IIngredient) => {
      dispatch({ type: ADD_BUN, payload: item });
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
          <ConstructorEmptyItemList
            placeholder={'Добавьте булку'}
            isOver={isOverTopBun || isOverBottomBun}
          />
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
          <ConstructorEmptyItemList
            placeholder={'Добавьте булку'}
            isOver={isOverTopBun || isOverBottomBun}
          />
        ) : (
          <ConstructorItem type="bottom" isLocked={true} item={bunItem} index={0} />
        )}
      </div>
    </div>
  );
};

export default ConstructorItemList;
