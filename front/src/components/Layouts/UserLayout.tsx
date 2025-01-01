import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "../Common/Navigation";
import CategoryList from "../User/CategoryList";
import SubcategoryList from "../User/SubcategoryList";
import LearnQuestions from "../User/LearnQuestions";
import TestQuestions from "../User/TestQuestions";

const UserLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <div className="flex justify-center mx-5 my-5 sm:my-10">
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
            path="subcategories/:subcategoryId/questions/test"
            element={<TestQuestions />}
          />

          <Route path="*" element={<Navigate to="categories" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default UserLayout;
