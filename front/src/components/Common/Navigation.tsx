import React from "react";
import Auth from "../Public/Auth";

const Navigation: React.FC = () => {
  return (
      <nav className="flex justify-end py-2 px-5 border-b-2">
        <Auth />
      </nav>
  );
};

export default Navigation;
