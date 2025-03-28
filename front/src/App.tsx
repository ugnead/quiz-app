import React from "react";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/Layouts/PublicLayout";
import UserLayout from "./components/Layouts/UserLayout";
import AdminLayout from "./components/Layouts/AdminLayout";

import { PublicRoute } from "./components/Routes/PublicRoute";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute";
import { AdminRoute } from "./components/Routes/AdminRoute";
import WaitForAuth from "./components/Routes/WaitForAuth";

import ErrorBoundary from "./components/Common/ErrorBoundary";
import NotFoundPage from "./components/Common/NotFoundPage";
import Home from "./components/Public/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </QueryClientProvider>
      </WaitForAuth>
    </ErrorBoundary>
  );
};

export default App;
