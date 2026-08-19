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
    item: () => ({ id: item.id, index }),
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

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverActualY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return;

      dispatch({
        type: MOVE_INGREDIENT,
        payload: { fromIndex: dragIndex, toIndex: hoverIndex },
      });

      // ✅ Мутируем индекс в drag item для предотвращения лишних вызовов hover
      draggedItem.index = hoverIndex;
    },
  });

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
