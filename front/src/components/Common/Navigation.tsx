import React from "react";
import Auth from "../Features/Auth";

const Navigation: React.FC = () => {
  return (
    <nav className='flex justify-end p-2 border-b-2'>
      <Auth/>
    </nav>
  );
};

export default Navigation;
