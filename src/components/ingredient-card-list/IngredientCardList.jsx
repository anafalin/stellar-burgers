import IngredientCard from '../ingredient-card/IngredientCard';
import style from './style.module.css';

const IngredientCardList = ({ title, items }) => {
  return (
    <>
      <h3 className={style.title}>{title}</h3>
      <div className={style.listWrapper}>
        {items.map((item) => (
          <IngredientCard
            key={item._id}
            item={item}
          />
        ))}
      </div>
    </>
  );
};

export default IngredientCardList;
