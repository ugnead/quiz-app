import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

interface SidebarProps {
  items: NavItem[];
  title?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, title }) => {
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
        className={`bg-white text-black w-64 h-full z-40 fixed top-0 left-0 md:relative duration-500 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="h-full px-4 py-9 border-r">
          {title && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
          )}
          <ul>
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center mb-2 py-2 px-4 rounded ${
                      isActive
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-100 transition-colors"
                    }`
                  }
                >
                  <item.icon className="mr-3 text-black" size={20} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button
          className={`md:hidden absolute top-16 sm:top-20 right-0 translate-x-full text-black p-3 z-50
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
