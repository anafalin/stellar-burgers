import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { ingredientById } from '../../services/constructor/selectors';
import { SELECT_PREVIEW_INGREDIENT } from '../../services/preview-ingredient/actions';

const IngredientCard = ({ item }) => {
  const dispatch = useDispatch();
  const count = useSelector(ingredientById(item._id));

  const [{ isDragging }, dragRef] = useDrag({
    type: item.type === 'bun' ? 'bun' : 'ingredient',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleOpenDetails = () => {
    dispatch({
      type: SELECT_PREVIEW_INGREDIENT,
      payload: item,
    });
  };

  return (
    <>
      <div
        className={style.wrapperCard}
        ref={dragRef}
        onClick={handleOpenDetails}
      >
        <h4>{item.name}</h4>
        <span className={style.priceWrapper}>
          {item.price}
          <CurrencyIcon type="primary" />
        </span>
        <div className={style.imgWrapper}>
          <img src={item.image} alt={item.name} />
        </div>
        {count > 0 && <span className={style.count}>{count}</span>}
      </div>
    </>
  );
};

export default IngredientCard;
