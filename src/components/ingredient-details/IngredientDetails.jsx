import Modal from '../modal/Modal';
import style from './style.module.css';

const IngredientDetails = ({ ingredient, onCLose }) => {
  return (
    <Modal title="Детали ингредиента" onClose={onCLose}>
      <div className={style.detailsWrapper}>
        <div className={style.imgWrapper}></div>
        <img src={ingredient.image} alt={ingredient.name} />
      </div>
      <p className={style.title}>{ingredient.name}</p>
      <div className={style.haracteristics}>
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
