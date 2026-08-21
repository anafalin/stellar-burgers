import React, { forwardRef } from 'react';
import style from './style.module.css';

interface IConstructorEmptyItemListProps {
  placeholder: string;
  isOver: boolean;
}

// forwardRef<ТипЭлемента, ТипПропсов>
const ConstructorEmptyItemList = forwardRef<HTMLDivElement, IConstructorEmptyItemListProps>(
  ({ placeholder, isOver }, ref) => {
    return (
      <div className={`${style.emptyElement} ${isOver ? style.emptyElementHover : ''}`} ref={ref}>
        {placeholder}
      </div>
    );
  },
);

// Добавляем displayName для удобной отладки в React DevTools (TS часто требует этого для forwardRef)
ConstructorEmptyItemList.displayName = 'ConstructorEmptyItemList';

export default ConstructorEmptyItemList;
