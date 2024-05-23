import React from "react";
import "./App.css";
import "../src/styles/main.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Features/Auth";
import CategoryList from "./components/Features/CategoryList";
import SubcategoryList from "./components/Features/SubcategoryList";
import Learn from "./components/Features/LearnQuestions";
import ErrorBoundary from "./components/Common/ErrorBoundary";

const App: React.FC = () => {
  return (
    <>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route
              path="/subcategories/:categoryId"
              element={<SubcategoryList />}
            />
             <Route path="/learn/:subcategoryId" element={<Learn />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </>
  );
};

export default App;
