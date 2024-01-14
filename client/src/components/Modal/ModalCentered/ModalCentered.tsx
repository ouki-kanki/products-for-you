import React from 'react'
import styles from './modalCentered.module.scss';
interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode
}


export const ModalCentered = ({ isOpen, onClose, children }: IModalProps) => {
  return (
    <>
      {isOpen && (
        <div className={styles.container} onClick={onClose}
        />
      )}
      <div className={`${styles.modal} ${isOpen && styles.modal__open}`}>{children}</div>
    </>
  );
};

