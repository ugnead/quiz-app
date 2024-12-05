import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "./Button";
import { IoClose } from "react-icons/io5";

interface Action {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info";
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: Action[];
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  className = "",
}) => {

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white rounded-lg shadow w-full max-w-lg p-10 relative ${className}`}
      >
        {title && (
          <h3 id="modal-title" className="mb-4">
            {title}
          </h3>
        )}
        <div>{children}</div>
        {actions.length > 0 && (
          <div className="flex justify-between space-x-2 mt-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "primary"}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-900"
        >
          <IoClose size={30} />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
