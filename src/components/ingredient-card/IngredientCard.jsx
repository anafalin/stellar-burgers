import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';

const IngredientCard = ({ title, proteins, image, onClick }) => {
  return (
    <div className={style.wrapperCard} onClick={onClick}>
      <h4>{title}</h4>
      <span className={style.proteinsWrapper}>
        {proteins}
        <CurrencyIcon type="primary" />
      </span>
      <div className={style.imgWrapper}>
        <img src={image} alt={title} />
      </div>
      <span className={style.count}>1</span>
    </div>
  );
};

export default IngredientCard;
