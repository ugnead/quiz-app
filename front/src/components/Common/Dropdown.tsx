import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none pt-2"
      >
        <FiMoreVertical size={20} />
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-0.5 w-32 bg-white border border-gray-200 rounded shadow z-50">
          <button
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Update
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
