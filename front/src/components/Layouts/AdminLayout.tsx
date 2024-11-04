import React from "react";
import Navigation from "../Common/Navigation";
import Sidebar from "../Common/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const adminNavItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Categories", path: "/admin/categories" },
    { label: "Subcategories", path: "/admin/subcategories" },
    { label: "Questions", path: "/admin/questions" },
    { label: "Users", path: "/admin/users" },
  ];

  return (
    <div className="admin-container">
      <Navigation />
      <Sidebar items={adminNavItems} className="admin-sidebar" />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
