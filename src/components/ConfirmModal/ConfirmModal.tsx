import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  cityName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  cityName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={onCancel}>
      <div 
        className="modal__box modal__box--confirm" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal__title">Delete City</h3>
        <p className="modal__text">
          Are you sure you want to delete <strong>{cityName}</strong>?
        </p>
        <div className="modal__buttons">
          <button
            type="button"
            className="modal__btn modal__btn--cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal__btn modal__btn--confirm"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};