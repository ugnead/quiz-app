import React from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
}

interface SidebarProps {
  items: NavItem[];
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, className = "" }) => {
  return (
    <nav className={`sidebar ${className}`}>
      <ul>
        {items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
