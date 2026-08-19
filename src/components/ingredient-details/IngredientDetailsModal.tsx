import style from './style.module.css';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IStore } from '../../utils/types';

const IngredientDetailsModal = () => {
  const { id } = useParams();

  // Получаем ингредиент из store (для модалки)
  const previewIngredient = useSelector((store: IStore) => store.previewIngredient.item);

  // Получаем все ингредиенты для поиска по ID (для страницы)
  const ingredients = useSelector((store: IStore) => store.ingredients.items);

  // Если есть previewIngredient - используем его (модалка)
  // Иначе ищем по ID из URL (страница)
  const ingredient = previewIngredient || ingredients.find((item) => item._id === id);

  // Добавляем проверку
  if (!ingredient) {
    return <></>;
  }

  return (
    <div className={style.detailsWrapper}>
      <div className={style.imgWrapper}>
        <img src={ingredient.image} alt={ingredient.name} />
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
    </div>
  );
};

export default IngredientDetailsModal;
