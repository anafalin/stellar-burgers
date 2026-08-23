import style from './style.module.css';

interface IFeedsResultProps {
  doneOrders: number[];
  pendingOrders: number[];
  total: number;
  totalToday: number;
}

const FeedResult = ({ doneOrders, pendingOrders, total, totalToday }: IFeedsResultProps) => {
  return (
    <div className={style.result}>
      <div className={style.statuses}>
        <div className={style.statusWrapper}>
          <p className={style.title}>Готовы:</p>
          <ul className={style.doneStatus}>
            {doneOrders.map((item, i) => (
              <li key={i}>{String(item).padStart(6, '0')}</li>
            ))}
          </ul>
        </div>
        <div className={style.statusWrapper}>
          <p className={style.title}>В работе:</p>
          <ul className={style.pendingStatus}>
            {pendingOrders.map((item, i) => (
              <li key={i}>{String(item).padStart(6, '0')}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <p className={style.totalTitle}>Выполнено за все время:</p>
        <p className={style.totalNumber}>{total}</p>
      </div>
      <div>
        <p className={style.totalTitle}>Выполнено за сегодня:</p>
        <p className={style.totalNumber}>{totalToday}</p>
      </div>
    </div>
  );
};

export default FeedResult;
