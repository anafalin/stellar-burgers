import IngredientCard from '../ingredient-card/IngredientCard';
import style from './style.module.css';

const IngredientCardList = ({ title, items, onClick }) => {
  return (
    <>
      <h3 className={style.title}>{title}</h3>
      <div className={style.listWrapper}>
        {items.map((item) => (
          <IngredientCard
            key={item._id}
            title={item.name}
            proteins={item.proteins}
            image={item.image}
            onClick={() => onClick(item)}
          />
        ))}
      </div>
    </>
  );
};

export default IngredientCardList;
