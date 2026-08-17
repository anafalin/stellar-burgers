import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import style from './style.module.css';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { DELETE_INGREDIENT, MOVE_INGREDIENT } from '../../services/constructor/actions';
import { useRef } from 'react';

const ConstructorItem = ({ index, type, isLocked, item }) => {
  const dispatch = useDispatch();
  const ref = useRef(null);

  const handleOnDrop = () => {
    dispatch({
      type: DELETE_INGREDIENT,
      payload: item.index,
    });
  };

  // Настройка Drag
  const [{ isDragging }, dragRef] = useDrag({
    type: 'sort_ingredient',
    item: () => ({ index }),
    canDrag: !isLocked,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Настройка Drop
  const [, dropRef] = useDrop({
    accept: 'sort_ingredient',
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // Если перетаскиваем над самим собой — ничего не делаем
      if (dragIndex === hoverIndex) return;

      // Вычисляем границы элемента на экране
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Находим вертикальную середину элемента
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Получаем координаты мыши
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Получаем расстояние от верха элемента до курсора мыши
      const hoverActualY = clientOffset.y - hoverBoundingRect.top;

      // Условия для оптимизации сортировки (чтобы не спамить экшенами)
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      // Вызываем экшен изменения позиции в редюсере
      dispatch({
        type: MOVE_INGREDIENT,
        payload: { fromIndex: dragIndex, toIndex: hoverIndex },
      });

      // Мутируем индекс перетаскиваемого объекта для плавной анимации
      draggedItem.index = hoverIndex;
    },
  });

  dragRef(ref);
  dropRef(ref);

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
