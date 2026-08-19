import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ingredientById } from '../../services/constructor/selectors';
import { SET_PREVIEW_INGREDIENT } from '../../services/preview-ingredient/actions';

const IngredientCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const count = useSelector(ingredientById(item._id));

  const [{ isDragging }, dragRef] = useDrag({
    type: item.type === 'bun' ? 'bun' : 'ingredient',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleOpenDetails = () => {
    // Сохраняем ингредиент в store
    dispatch({
      type: SET_PREVIEW_INGREDIENT,
      payload: item,
    });

    // Переходим на страницу ингредиента с сохранением фона
    navigate(`/ingredients/${item._id}`, {
      state: { background: location },
    });
  };

  return (
    <div
      className={style.wrapperCard}
      onClick={handleOpenDetails}
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
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
  );
};

export default IngredientCard;
