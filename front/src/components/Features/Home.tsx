import React from "react";
import { useMediaQuery } from "react-responsive";
import Auth from "./Auth";

const Home: React.FC = () => {
  // Define the media query for a large screen (e.g., 1024px or larger)
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1024px)"
  });

  return (
    <div className="h-screen">
      {isDesktopOrLaptop ? (
        // Desktop and Laptop Design
        <div className="flex items-center h-full">
          <div className="w-3/4 h-3/4 bg-white shadow-lg rounded-lg overflow-hidden mx-auto flex">
            <div className="w-1/2 bg-primary flex items-center justify-center">
              <img
                src="images/banner.webp"
                alt="Quiz App"
                className="w-4/5 h-auto"
              />
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center p-8">
              <h1 className="text-4xl font-bold mb-6 text-center">
                Welcome to Quiz App
              </h1>
              <p className="text-lg mb-6 text-center">
                Please log in to continue
              </p>
              <Auth />
            </div>
          </div>
        </div>
      ) : (
        // Mobile Design
        <div className="h-screen flex flex-col">
          {/* Top section with primary background color */}
          <div className="flex-1 flex items-end justify-center bg-primary p-4 h-1/2">
            <img
              src="images/banner.webp"
              alt="Quiz App"
              className="w-full max-w-xs h-auto"
            />
          </div>
          {/* Bottom section with white background */}
          <div className="flex-1 flex flex-col items-center justify-top bg-white p-6 h-1/2">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Welcome to Quiz App
            </h1>
            <p className="text-base md:text-lg mb-4 text-center">
              Please log in to continue
            </p>
            <Auth />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
