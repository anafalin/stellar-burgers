import IngredientCard from '../ingredient-card/IngredientCard';
import style from './style.module.css';
import { IIngredient } from '../../utils/types';

interface IngredientCardListProps {
  title: string;
  items: IIngredient[];
}

const IngredientCardList = ({ title, items }: IngredientCardListProps) => {
  return (
    <>
      <h3 className={style.title}>{title}</h3>
      <div className={style.listWrapper}>
        {items.map((item) => (
          <IngredientCard key={item._id} item={item} />
        ))}
      </div>
    </>
  );
};

export default IngredientCardList;
