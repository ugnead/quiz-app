import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerClassName = "",
  className = "",
  type = "text",
  id,
  readOnly = false,
  ...props
}) => {
  const inputId = id || `input-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        readOnly={readOnly}
        className={`block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${readOnly ? "bg-gray-100" : ""} ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Input;