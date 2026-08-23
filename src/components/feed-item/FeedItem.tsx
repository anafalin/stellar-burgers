import style from './style.module.css';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { TFeedOrderStatus } from '../../utils/types';
import { formatDate } from '../../utils/date';

interface IFeedItemProp {
  id: string;
  number: number;
  status: TFeedOrderStatus;
  name: string;
  ingredients: string[];
  created_at: string;
  sum: number;
}

const FeedItem = ({ id, number, status, name, ingredients, sum, created_at }: IFeedItemProp) => {
  console.log(id, number, status, name, ingredients, sum, created_at);
  return (
    <div className={style.feedWrapper}>
      <div className={style.head}>
        <p className={style.number}>#{number < 10000 ? `0${number}` : `${number}`}</p>
        <p className={style.createdAt}>{formatDate(created_at)}</p>
      </div>
      <p className={style.name}>{name}</p>
      <div className={style.details}>
        <div className={style.ingredients}>
          {/* Добавлен уникальный key (сочетание url и индекса) и атрибут alt */}
          {ingredients.map((item, index) => (
            <div key={`${item}-${index}`} className={style.imgWrapper}>
              <img src={item} alt={`Ингредиент ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className={style.sum}>
          {sum}&nbsp;
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default FeedItem;
