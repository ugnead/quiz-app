import React from "react";
import { Routes, Route } from "react-router-dom";
import CategoryList from "./components/User/CategoryList";
import SubcategoryList from "./components/User/SubcategoryList";
import LearnQuestions from "./components/User/LearnQuestions";
import TestQuestions from "./components/User/TestQuestions";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import { useAuth } from "./contexts/AuthContext";
import PublicLayout from "./components/Layouts/PublicLayout";
import UserLayout from "./components/Layouts/UserLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import HomeRedirect from "./components/Common/HomeRedirect";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomeRedirect />} />
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
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
