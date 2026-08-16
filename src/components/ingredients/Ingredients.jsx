import IngredientCardList from '../ingredient-card-list/IngredientCardList';
import IngredientDetails from '../ingredient-details/IngredientDetails';
import style from './style.module.css';
import { products } from '../../utils/data';
import useModal from '../../hooks/useModal';

const Ingredients = ({ ingredients }) => {
  const { isOpen, selectedItem, openModal, closeModal } = useModal();
  const ingredientsByType = products.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  const groupTitle = {
    'bun': 'Булки',
    'main': 'Начинки',
    'sauce': 'Соусы',
  };
  const groups = Object.entries(ingredientsByType).map(([type, items]) => ({
    type,
    title: groupTitle[type],
    items,
  }));


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
        {groups.map(({ type, title, items }) => (
          <IngredientCardList key={type} title={title} items={items} onClick={openModal} />
        ))}
        {isOpen && selectedItem && <IngredientDetails ingredient={selectedItem} onCLose={closeModal} />}
      </div>
    </div>
  );
};

export default Ingredients;
