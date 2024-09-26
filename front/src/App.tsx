import React from "react";
import "./App.css";
import "../src/styles/main.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/Features/Home";
import CategoryList from "./components/Features/CategoryList";
import SubcategoryList from "./components/Features/SubcategoryList";
import LearnQuestions from "./components/Features/LearnQuestions";
import TestQuestions from "./components/Features/TestQuestions";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import Navigation from "./components/Common/Navigation";

const App: React.FC = () => {

  const isHomePage = location.pathname === "/";

  return (
    <>
      <ErrorBoundary>
        <Router>
          {!isHomePage && <Navigation />}
          <div
            className={
              isHomePage ? "" : "flex justify-center mx-5 my-5 sm:my-10"
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route
                path="/subcategories/:categoryId"
                element={<SubcategoryList />}
              />
              <Route
                path="/learn/:subcategoryId"
                element={<LearnQuestions />}
              />
              <Route path="/test/:subcategoryId" element={<TestQuestions />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </>
  );
};

export default App;
