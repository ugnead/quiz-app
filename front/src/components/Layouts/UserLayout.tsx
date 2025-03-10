import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import CategoryList from "../User/CategoryList";
import SubcategoryList from "../User/SubcategoryList";
import LearnQuestions from "../User/LearnQuestions";
import TestQuestions from "../User/TestQuestions";
import Profile from "../User/Profile";
import { useAuth } from "../../contexts/AuthContext";

import Navigation from "../Common/Navigation";
import Sidebar from "../Common/Sidebar";
import Button from "../Common/Button";

import { FaQuestionCircle, FaUser } from "react-icons/fa";

const navItems = [
  { label: "Quiz", path: "/quiz/categories", icon: FaQuestionCircle },
  { label: "Profile", path: "/quiz/profile", icon: FaUser },
];

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.name.split(" ")[0];

  return (
    <>
      <div className="flex flex-col min-h-screen h-auto">
        <Navigation />
        <div className="flex flex-1">
          <Sidebar
            items={navItems}
            title={user ? `Hello, ${firstName}!` : "User Panel"}
            footer={
              user && user.role === "admin" ? (
                <Button
                  onClick={() => navigate("/admin/categories")}
                  fullWidth
                  variant="secondary"
                >
                  Switch to Admin Panel
                </Button>
              ) : null
            }
          />
          <div className="flex-1 p-5 pb-10 sm:p-10 sm:pt-9 min-w-0">
            <div className="w-full max-w-lg mx-auto break-words">
              <Routes>
                <Route index element={<Navigate to="categories" replace />} />
                <Route path="categories" element={<CategoryList />} />
                <Route
                  path="categories/:categoryId/subcategories"
                  element={<SubcategoryList />}
                />
                <Route
                  path="subcategories/:subcategoryId/questions/learn"
                  element={<LearnQuestions />}
                />
                <Route
                  path="subcategories/:subcategoryId/questions"
                  element={<TestQuestions />}
                />
                <Route
                  path="profile"
                  element={<Profile />}
                />

                <Route
                  path="*"
                  element={<Navigate to="categories" replace />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
