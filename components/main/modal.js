import React from 'react';
import styles from './modal.module.css'; // Стили для модального окна
import { useEffect  } from 'react';
import useTranslation from 'next-translate/useTranslation';

const Modal = ({ isOpen, onClose, children }) => {
  const {t} = useTranslation('common');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
        <button className={styles.button}onClick={onClose}>{t('close')}</button>
      </div>
    </div>
  );
};

export default Modal;