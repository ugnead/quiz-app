import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navigation from "../Common/Navigation";
import Sidebar from "../Common/Sidebar";
import { FaQuestionCircle, FaUser } from "react-icons/fa";
import AdminCategoryList from "../Admin/CategoryList";
import AdminSubcategoryList from "../Admin/SubcategoryList";
import UserList from "../Admin/UserList";
import Button from "../Common/Button";

const navItems = [
  { label: "Quiz", path: "/admin/categories", icon: FaQuestionCircle },
  { label: "Users", path: "/admin/users", icon: FaUser },
];

const Layout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col min-h-screen h-auto">
        <Navigation />
        <div className="flex flex-1">
          <Sidebar items={navItems} title="Admin Panel" />

          <div className="flex-1 p-5 pb-10 sm:p-10 min-w-0">
            <div className="w-full max-w-4xl mx-auto">
              <Routes>
                <Route index element={<Navigate to="categories" replace />} />
                <Route path="categories" element={<AdminCategoryList />} />
                <Route
                  path="categories/:categoryId/subcategories"
                  element={<AdminSubcategoryList />}
                />
                <Route path="users" element={<UserList />} />

                <Route
                  path="*"
                  element={<Navigate to="categories" replace />}
                />
              </Routes>
              <Button onClick={() => navigate("/quiz/categories")}>
                User Panel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
