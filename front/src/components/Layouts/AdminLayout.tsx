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
      <Navigation />
      <div className="flex h-screen">
        <Sidebar items={navItems} title="Admin Panel" />

        <div className="w-full p-5 sm:p-10 flex justify-center">
          <div className="w-full max-w-4xl">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
