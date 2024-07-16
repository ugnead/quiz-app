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
      <div className="bg-white p-6 rounded-md">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
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
