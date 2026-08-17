import style from './style.module.css';

const ConstructorEmptyItemList = ({ placeholder }) => {
  return (
    <div className={style.emptyElement}>
     {placeholder}
    </div>
  );
};

export default ConstructorEmptyItemList;
