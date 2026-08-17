import IngredientCardList from '../ingredient-card-list/IngredientCardList';
import IngredientDetails from '../ingredient-details/IngredientDetails';
import style from './style.module.css';
import useModal from '../../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { bunIngredients, mainIngredients, sauceIngredients } from '../../services/ingredients/selectors';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/ingredients/actions';

const Ingredients = () => {
  const { isOpen, selectedItem, openModal, closeModal } = useModal();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const isLoading = useSelector((store) => store.ingredients.isLoading);
  const error = useSelector((store) => store.ingredients.error);

  const buns = useSelector(bunIngredients);
  const mains = useSelector(mainIngredients);
  const sauces = useSelector(sauceIngredients);

  const groups = {
    bun: 'Булки',
    main: 'Начинки',
    sauce: 'Соусы',
  };

  if (isLoading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className={style.menuWrapper}>
      <div className={style.menuNav}>
        <h2 className={style.visuallyHidden}>Меню</h2>
        <p className={style.title}>Соберите бургер</p>
        <ul className={style.tabsList}>
          <li>
            <button className={`${style.tab} ${style.active}`}>Булки</button>
          </li>
          <li>
            <button className={style.tab}>Соусы</button>
          </li>
          <li>
            <button className={style.tab}>Начинки</button>
          </li>
        </ul>
      </div>
      <div className={style.menuContent}>
        {buns.length > 0 && <IngredientCardList title={groups.bun} items={buns} onClick={openModal} />}

        {mains.length > 0 && <IngredientCardList title={groups.main} items={mains} onClick={openModal} />}

        {sauces.length > 0 && <IngredientCardList title={groups.sauce} items={sauces} onClick={openModal} />}

        {isOpen && selectedItem && <IngredientDetails ingredient={selectedItem} onCLose={closeModal} />}
      </div>
    </div>
  );
};

export default Ingredients;
