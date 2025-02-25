import React from "react";

interface ProgressBarProps {
  progress: number;
  height?: string;
  bgColor?: string;
  fillColor?: string;
  rounded?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = "h-6",
  bgColor = "bg-gray-200",
  fillColor = "bg-blue-200",
  rounded = true,
}) => {
  const borderRadius = rounded ? "rounded-full" : "";
  
  return (
    <div className={`w-full ${bgColor} ${borderRadius} ${height}`}>
      <div
        className={`${fillColor} ${borderRadius} ${height}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
