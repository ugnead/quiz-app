import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

interface SidebarProps {
  items: NavItem[];
  title?: string;
  footer?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ items, title, footer }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`max-md:h-full bg-white text-black w-60 z-40 fixed top-0 left-0 md:relative duration-500 ease-in-out border-r
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <nav className="px-4 py-10 flex-1 overflow-auto">
            {title && (
              <div className="text-center mb-7">
                <h3>{title}</h3>
              </div>
            )}
            <ul>
              {items.map((item) => (
                <li key={uuidv4()}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center mb-2 py-2 px-4 rounded ${
                        isActive
                          ? "bg-gray-200"
                          : "hover:bg-gray-100 transition-colors"
                      }`
                    }
                  >
                    <item.icon className="mr-3 text-black" size={18} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {footer && (
            <div className="p-4">{footer}</div>
          )}
        </div>

        <button
          className={`md:hidden absolute top-[70px] sm:top-[88px] right-[-15px] sm:right-[-35px] translate-x-full text-black p-2 z-50 bg-gray-100 rounded-full
            ${isOpen ? "hidden" : ""}`}
          onClick={toggleSidebar}
        >
          <MdKeyboardDoubleArrowRight size={35} />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
