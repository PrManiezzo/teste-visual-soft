import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, title, message, onConfirm, onCancel, 
  confirmText = 'Confirmar', cancelText = 'Cancelar', isDanger = false, isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content card">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>{cancelText}</Button>
          <Button onClick={onConfirm} disabled={isLoading} style={isDanger ? { backgroundColor: 'var(--danger)' } : {}}>
            {isLoading ? 'Aguarde...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
