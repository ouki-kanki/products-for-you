import { useRef, ReactNode, useState, useEffect } from 'react'
import styles from './modal.module.scss';

interface IModal {
  children: ReactNode,
  isOpen: boolean,
  onClose: () => void
}

// TODO this used the dialog component check if it's compatible with the majority of the browsers & if it's mobile friendly
export const Modal = ({ children, isOpen }: IModal) => {
  const modalRef = useRef<HTMLDialogElement | null>(null)
  const [isModalOpen, setModalOpen] = useState(isOpen)

  useEffect(() => {
    setModalOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    const modal = modalRef.current;

    if (modal) {
      if (isModalOpen) {
        modal.showModal(); // this is the method of the dialogElement
      } else {
        modal.close()
      }
    }
  }, [isModalOpen])

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  // hanle the esc key
  const hadnleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      handleCloseModal()
    }
  }


  return (
    <dialog
      onClick={handleCloseModal}
      ref={modalRef}
      className={styles.modal}
      onKeyDown={hadnleKeyDown}
      >
        <div
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
    </dialog>
  )
}
