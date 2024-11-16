import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md m-5">
        <p className="mb-4">{message}</p>
        <div className="flex justify-between space-x-4">
          <Button
            onClick={onCancel}
            variant="danger"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="success"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
