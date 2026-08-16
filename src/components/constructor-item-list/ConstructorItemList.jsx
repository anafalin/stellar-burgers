import ConstructorItem from '../constructor-item/ConstructorItem';
import style from './style.module.css';

const ConstructorItemList = () => {
  return (
    <div className={style.constructorList}>
      <ConstructorItem
        type="top"
        isLocked={true}
        text="Краторная булка N-200i (верх)"
        price={20}
        thumbnail={'https://code.s3.yandex.net/react/code/bun-02.png'}
      />
      <ConstructorItem
        text="Соус традиционный галактический"
        price={30}
        thumbnail={'https://code.s3.yandex.net/react/code/sauce-03.png'}
      />
      <ConstructorItem
        text="Мясо бессмертных моллюсков Protostomia"
        price={300}
        thumbnail={'https://code.s3.yandex.net/react/code/meat-02.png'}
      />
      <ConstructorItem
        text="Плоды Фалленианского дерева"
        price={80}
        thumbnail={'https://code.s3.yandex.net/react/code/sp_1.png'}
      />
      <ConstructorItem
        text="Хрустящие минеральные кольца"
        price={80}
        thumbnail={'https://code.s3.yandex.net/react/code/mineral_rings.png'}
      />
      <ConstructorItem
        text="Хрустящие минеральные кольца"
        price={80}
        thumbnail={'https://code.s3.yandex.net/react/code/mineral_rings.png'}
      />
      <ConstructorItem
        type="bottom"
        isLocked={true}
        text="Краторная булка N-200i (низ)"
        price={20}
        thumbnail={'https://code.s3.yandex.net/react/code/bun-02.png'}
      />
    </div>
  );
};

export default ConstructorItemList;
