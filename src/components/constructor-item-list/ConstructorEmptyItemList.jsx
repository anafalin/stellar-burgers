import style from './style.module.css';
import { forwardRef } from 'react';

const ConstructorEmptyItemList = forwardRef(({ placeholder, isOver }, ref) => {
  return (
    <div className={`${style.emptyElement} ${isOver ? style.emptyElementHover : ''}`} ref={ref}>
      {placeholder}
    </div>
  );
});

export default ConstructorEmptyItemList;
