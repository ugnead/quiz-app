import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "lightGray";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  enableFocusRing?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  children,
  className = "",
  enableFocusRing = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center border border-transparent font-medium rounded-lg transition-colors duration-200";

  const variantClasses = {
    primary: "text-white bg-blue-600 hover:bg-blue-700",
    secondary: "text-white bg-gray-900 hover:bg-gray-800",
    danger: "text-white bg-red-600 hover:bg-red-700",
    success: "text-white bg-green-600 hover:bg-green-700",
    warning: "text-white bg-yellow-500 hover:bg-yellow-600",
    info: "text-white bg-teal-500 hover:bg-teal-600",
    lightGray: "bg-gray-200 hover:bg-gray-300",
  };

  const focusRingBaseClasses =
    "focus:outline-none focus:ring-2 focus:ring-offset-2";

  const focusRingVariantClasses = {
    primary: "focus:ring-blue-600",
    secondary: "focus:ring-gray-900",
    danger: "focus:ring-red-600",
    success: "focus:ring-green-600",
    warning: "focus:ring-yellow-500",
    info: "focus:ring-teal-500",
    lightGray: "focus:ring-gray-200",
  };

  const sizeClasses = {
    small: "px-2 py-1.2 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-5 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const disabledClass = disabled ? "opacity-70 cursor-not-allowed" : "";

  const focusClasses = enableFocusRing
    ? [focusRingBaseClasses, focusRingVariantClasses[variant]]
    : [];

  const finalClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    disabledClass,
    className,
    ...focusClasses,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={finalClassName} disabled={disabled} {...props}>
      {startIcon && <span className="mr-2 mt-0.5">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-2 mt-0.5">{endIcon}</span>}
    </button>
  );
};

export default Button;
