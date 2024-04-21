import React from "react";
import "./App.css";
import "../src/styles/main.scss";
import Auth from "./components/Features/Auth";
import { LoadingProvider } from "../src/contexts/LoadingContext";

const App: React.FC = () => {
  return (
    <>
      <LoadingProvider>
        <Auth />
      </LoadingProvider>
    </>
  );
};

export default App;
