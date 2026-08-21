import { createPortal } from 'react-dom';
import ModalOverlay from '../modal-overlay/ModalOverlay';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useEffect } from 'react';
import style from './style.module.css';

const modal = document.getElementById('modal') as HTMLDivElement;

interface IModalProps {
  title?: string;
  children?: React.ReactNode[] | React.ReactNode;
  onClose: () => void;
}

const Modal = ({ title, children, onClose }: IModalProps) => {
  useEffect(() => {
    const handleEscDown = (event: KeyboardEvent) => {
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
      <div className={style.modalContainer}>
        <div className={`${style.head} ${title !== null ? style.headWithoutTitle : ''}`}>
          {title !== null ? (
            <h2 className={style.title}>{title}</h2>
          ) : (
            <div className={style.spacer} />
          )}

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
