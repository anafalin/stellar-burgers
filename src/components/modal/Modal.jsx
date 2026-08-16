import { createPortal } from 'react-dom';
import ModalOverlay from '../modal-overlay/ModalOverlay';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useEffect } from 'react';
import style from './style.module.css';

const modal = document.getElementById('modal');

const Modal = (title, children, onClose) => {
  useEffect(() => {
    const handleEscDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscDown);

    return () => {
      document.removeEventListener('keydown', handleEscDown);
    };
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay />
      <div className={`${style.modalContainer} ${!title ? style.modalWithoutTitle : ''}`}>
        <div className={`${style.head} ${!title ? style.headWithoutTitle : ''}`}>
          {title ? <h2 className={style.title}>{title}</h2> : +(<div className={style.spacer} />)}

          <button className={style.btnWrapper} onClick={onClose} onKeyDown={onClose} type="button">
            <CloseIcon type="primary" />
          </button>
        </div>

        {children}
      </div>
    </>,
    modal,
  );
};

export default Modal;
