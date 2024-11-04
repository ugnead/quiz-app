import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Public/Home";
import CategoryList from "./components/User/CategoryList";
import SubcategoryList from "./components/User/SubcategoryList";
import LearnQuestions from "./components/User/LearnQuestions";
import TestQuestions from "./components/User/TestQuestions";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import { useAuth } from "./contexts/AuthContext";
import PublicLayout from "./components/Layouts/PublicLayout";
import UserLayout from "./components/Layouts/UserLayout";
import AdminLayout from "./components/Layouts/AdminLayout";

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {user && (
          <Route element={<UserLayout />}>
            <Route path="/categories" element={<CategoryList />} />
            <Route
              path="/categories/:categoryId/subcategories"
              element={<SubcategoryList />}
            />
            <Route
              path="/subcategories/:subcategoryId/questions/learn"
              element={<LearnQuestions />}
            />
            <Route
              path="/subcategories/:subcategoryId/questions/test"
              element={<TestQuestions />}
            />
          </Route>
        )}

        {user && user.role === "admin" && (
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="categories" element={<CategoryList />} />
            <Route path="subcategories" element={<SubcategoryList />} />
            <Route path="questions" element={<SubcategoryList />} />
          </Route>
        )}

        <Route
          path="*"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin/categories" />
              ) : (
                <Navigate to="/categories" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
