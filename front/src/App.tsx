import React from "react";
import "./App.css";
import "../src/styles/main.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Features/Home";
import CategoryList from "./components/Features/CategoryList";
import SubcategoryList from "./components/Features/SubcategoryList";
import LearnQuestions from "./components/Features/LearnQuestions";
import TestQuestions from "./components/Features/TestQuestions";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import Navigation from "./components/Common/Navigation";
import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      {user && <Navigation />}
      <div className={user ? "flex justify-center mx-5 my-5 sm:my-10" : ""}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/categories" /> : <Home />}
          />
          <Route path="/categories" element={<CategoryList />} />
          <Route
            path="/subcategories/:categoryId"
            element={<SubcategoryList />}
          />
          <Route path="/learn/:subcategoryId" element={<LearnQuestions />} />
          <Route path="/test/:subcategoryId" element={<TestQuestions />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
