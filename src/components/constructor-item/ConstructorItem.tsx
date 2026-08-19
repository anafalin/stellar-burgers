import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';
import { DELETE_INGREDIENT, MOVE_INGREDIENT } from '../../services/constructor/actions';
import { IIngredient } from '../../utils/types';

// Описываем интерфейс пропсов для компонента
interface IConstructorItemProps {
  index: number | 0;
  type?: 'top' | 'bottom'; // Уточняем типы для ConstructorElement (может быть undefined для начинок)
  isLocked?: boolean | false;
  item: IIngredient & { id?: string; index?: number }; // Учитываем UUID (id) и внутренний индекс dnd
}

// Описываем объект, который перетаскивается (Drag Item)
interface IDragItem {
  id: string;
  index: number;
}

// Заглушка для useDispatch (если у вас настроен AppDispatch, замените тип)
type AppDispatch = any;

const ConstructorItem: React.FC<IConstructorItemProps> = ({
  index,
  type,
  isLocked,
  item,
}: IConstructorItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // Указываем точный тип элемента HTMLDivElement для рефа
  const ref = useRef<HTMLDivElement>(null);

  const handleOnDrop = (): void => {
    dispatch({
      type: DELETE_INGREDIENT,
      payload: item.index,
    });
  };

  // Настройка Drag
  const [{ isDragging }, dragRef] = useDrag<IDragItem, unknown, { isDragging: boolean }>({
    type: 'sort_ingredient',
    item: () => ({ id: item.id || '', index }),
    canDrag: !isLocked,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Настройка Drop
  const [, dropRef] = useDrop<IDragItem, void, unknown>({
    accept: 'sort_ingredient',
    hover: (draggedItem: IDragItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // Получаем размеры и положение элемента на экране
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Типизируем координаты мыши как XYCoord из react-dnd
      const clientOffset = monitor.getClientOffset() as XYCoord | null;
      if (!clientOffset) return;

      const hoverActualY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      dispatch({
        type: MOVE_INGREDIENT,
        payload: { fromIndex: dragIndex, toIndex: hoverIndex },
      });

      // Мутируем индекс в drag item для предотвращения лишних вызовов hover
      draggedItem.index = hoverIndex;
    },
  });

  // В TypeScript для react-dnd правильное связывание рефов выглядит так:
  dragRef(dropRef(ref));

  const opacity = isDragging ? 0 : 1;

  return (
    <div className={style.itemCard} ref={ref} style={{ opacity }}>
      {!isLocked && (
        <div className={style.dragIcon}>
          <DragIcon type="primary" />
        </div>
      )}
      <ConstructorElement
        type={type}
        isLocked={isLocked}
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={type === undefined ? handleOnDrop : undefined}
      />
    </div>
  );
};

export default ConstructorItem;
