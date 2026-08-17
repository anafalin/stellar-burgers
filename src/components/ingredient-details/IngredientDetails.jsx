import Modal from '../modal/Modal';
import style from './style.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RESET_PREVIEW_INGREDIENT } from '../../services/preview-ingredient/actions';

const IngredientDetails = () => {
  const dispatch = useDispatch();
  const ingredient = useSelector((store) => store.previewIngredient.item);

  const handCloseDetails = () => {
    dispatch({ type: RESET_PREVIEW_INGREDIENT });
  };

  if (!ingredient) return null;

  return (
    <Modal title="Детали ингредиента" onClose={handCloseDetails}>
      <div className={style.detailsWrapper}>
        <div className={style.imgWrapper}>
          <img src={ingredient.image_large} alt={ingredient.name} />
        </div>
      </div>
      <p className={style.title}>{ingredient.name}</p>
      <div className={style.specs}>
        <div className={style.item}>
          <div>Калории, ккал</div>
          <div className={style.value}>{ingredient.calories}</div>
        </div>
        <div className={style.item}>
          <div>Белки, г</div>
          <div className={style.value}>{ingredient.proteins}</div>
        </div>
        <div className={style.item}>
          <div>Жиры, г</div>
          <div className={style.value}>{ingredient.fat}</div>
        </div>
        <div className={style.item}>
          <div>Углеводы, г</div>
          <div className={style.value}>{ingredient.carbohydrates}</div>
        </div>
      </div>
    </Modal>
  );
};

export default IngredientDetails;
