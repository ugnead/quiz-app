import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CategoryList from "../User/CategoryList";
import SubcategoryList from "../User/SubcategoryList";
import LearnQuestions from "../User/LearnQuestions";
import TestQuestions from "../User/TestQuestions";
import { useAuth } from "../../contexts/AuthContext";

import Navigation from "../Common/Navigation";
import Sidebar from "../Common/Sidebar";

import { FaQuestionCircle } from "react-icons/fa";

const navItems = [
  { label: "Quiz", path: "/quiz/categories", icon: FaQuestionCircle },
];

const UserLayout: React.FC = () => {
  const { user } = useAuth();

  const firstName = user?.name.split(" ")[0];

  return (
    <>
      <div className="flex flex-col min-h-screen h-auto">
        <Navigation />
        <div className="flex flex-1">
          <Sidebar items={navItems} title={user ? `Hello, ${firstName}!` : "User Panel"} />
          <div className="flex justify-center mx-5 my-5 sm:my-10">
            <div className="w-full max-w-4xl mx-auto">
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
