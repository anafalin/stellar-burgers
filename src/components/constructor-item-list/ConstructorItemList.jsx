import ConstructorItem from '../constructor-item/ConstructorItem';
import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { bun, ingredients } from '../../services/constructor/selectors';
import ConstructorEmptyItemList from './ConstructorEmptyItemList';
import { useDrop } from 'react-dnd';
import { ADD_BUN, ADD_INGREDIENT } from '../../services/constructor/actions';

const ConstructorItemList = () => {
  const dispatch = useDispatch();
  const bunItem = useSelector(bun);
  const ingredientItems = useSelector(ingredients);

  const [{ isOverTopBun }, dropTopBunRef] = useDrop({
    accept: 'bun',
    drop: (item) => {
      dispatch({ type: ADD_BUN, payload: item });
    },
    collect: (monitor) => ({
      isOverTopBun: monitor.isOver(),
    }),
  });

  const [{ isOverIngredient }, dropIngredientRef] = useDrop({
    accept: 'ingredient',
    drop: (item) => {
      dispatch({ type: ADD_INGREDIENT, payload: item });
    },
    collect: (monitor) => ({
      isOverIngredient: monitor.isOver(),
    }),
  });

  const [{ isOverBottomBun }, dropBottomBunRef] = useDrop({
    accept: 'bun',
    drop: (item) => {
      dispatch({ type: ADD_BUN, payload: item });
    },
    collect: (monitor) => ({
      isOverBottomBun: monitor.isOver(),
    }),
  });

  return (
    <div className={style.list}>
      <div className={style.item} ref={dropTopBunRef}>
        {bunItem == null ? (
          <ConstructorEmptyItemList placeholder={'Добавьте булку'} isOver={isOverTopBun || isOverBottomBun} />
        ) : (
          <ConstructorItem type="top" isLocked={true} item={bunItem} />
        )}
      </div>

      <div className={style.ingredientList} ref={dropIngredientRef}>
        {ingredientItems.length === 0 ? (
          <ConstructorEmptyItemList placeholder={'Добавьте ингредиент'} isOver={isOverIngredient} />
        ) : (
          ingredientItems.map((item, index) => <ConstructorItem key={index} index={index} item={item} />)
        )}
      </div>

      <div className={style.item} ref={dropBottomBunRef}>
        {bunItem == null ? (
          <ConstructorEmptyItemList placeholder={'Добавьте булку'} isOver={isOverTopBun || isOverBottomBun} />
        ) : (
          <ConstructorItem type="bottom" isLocked={true} item={bunItem} />
        )}
      </div>
    </div>
  );
};

export default ConstructorItemList;
