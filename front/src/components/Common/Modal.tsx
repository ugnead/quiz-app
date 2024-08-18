import React from 'react';

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
          <button
            className="bg-red-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-green-500"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
