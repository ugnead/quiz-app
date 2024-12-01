import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

interface Item {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

interface DropdownProps {
  items: Item[];
}

const Dropdown: React.FC<DropdownProps> = ({ items }) => {
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
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${item.className || ""}`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
