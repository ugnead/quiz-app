import React from "react";
import Navigation from "../Common/Navigation";
import { Outlet } from "react-router-dom";

const UserLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <div className="flex justify-center mx-5 my-5 sm:my-10">
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
