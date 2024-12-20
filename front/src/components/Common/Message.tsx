import React from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

interface MessageProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: "info" | "warning" | "error" | "success";
}

const variantClasses: Record<NonNullable<MessageProps["variant"]>, string> = {
  info: "bg-blue-100 text-blue-900",
  warning: "bg-yellow-100 text-yellow-900",
  error: "bg-red-100 text-red-900",
  success: "bg-green-100 text-green-900",
};

const variantIcons: Record<
  NonNullable<MessageProps["variant"]>,
  React.ReactNode
> = {
  info: <FiInfo size={24} className="text-blue-600" />,
  warning: <FiAlertTriangle size={24} className="text-yellow-600" />,
  error: <FiAlertCircle size={24} className="text-red-600" />,
  success: <FiCheckCircle size={24} className="text-green-600" />,
};

const Message: React.FC<MessageProps> = ({
  message,
  icon,
  className = "",
  variant = "info",
}) => {
  const variantClass = variantClasses[variant];
  const defaultIcon = variantIcons[variant];

  return (
    <div
      className={`text-center p-5 rounded-lg flex flex-col items-center justify-center ${variantClass} ${className}`}
    >
      <div className="mb-3">{icon ?? defaultIcon}</div>
      <p>{message}</p>
    </div>
  );
};

export default Message;
