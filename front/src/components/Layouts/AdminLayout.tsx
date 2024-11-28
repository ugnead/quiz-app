import React from "react";
import Navigation from "../Common/Navigation";
import Sidebar from "../Common/Sidebar";
import { Outlet } from "react-router-dom";
import { FaQuestionCircle, FaUser } from "react-icons/fa";

const navItems = [
  { label: "Quiz", path: "/admin/categories", icon: FaQuestionCircle },
  { label: "Users", path: "/admin/users", icon: FaUser },
];

const Layout: React.FC = () => {
  return (
    <>
    <div className="flex flex-col min-h-screen h-auto">
      <Navigation />
      <div className="flex flex-1">
        <Sidebar items={navItems} title="Admin Panel" />

        <div className="flex-1 p-5 pb-10 sm:p-10 min-w-0">
          <div className="w-full max-w-4xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Layout;
