import React from "react";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/Layouts/PublicLayout";
import UserLayout from "./components/Layouts/UserLayout";
import AdminLayout from "./components/Layouts/AdminLayout";

import { PublicRoute } from "./components/Routes/PublicRoute";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute";
import { AdminRoute } from "./components/Routes/AdminRoute";

import ErrorBoundary from "./components/Common/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Public/Home";
import WaitForAuth from "./components/Routes/WaitForAuth";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <WaitForAuth>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <PublicLayout />
              </PublicRoute>
            }
          >
            <Route index element={<Home />} />
          </Route>

          <Route
            path="/quiz/*"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          />
        </Routes>
      </WaitForAuth>
    </ErrorBoundary>
  );
};

export default App;
