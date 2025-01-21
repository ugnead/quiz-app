import React from "react";
import { useField } from "formik";
import { v4 as uuidv4 } from "uuid";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps & { name: string }> = ({
  name,
  label,
  helperText,
  containerClassName = "",
  className = "",
  type = "text",
  id,
  readOnly = false,
  ...props
}) => {
  const [field, meta] = useField(name);
  const inputId = id || uuidv4();

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium mb-1 pointer-events-none"
        >
          {label}
        </label>
      )}
      <input
        {...field}
        type={type}
        id={inputId}
        readOnly={readOnly}
        className={`block w-full border rounded-md px-3 py-2 cursor-pointer
          ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"} 
          ${readOnly ? "bg-gray-200 text-gray-500 pointer-events-none" : "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"} ${className}`}
        {...props}
      />
      {helperText && !meta.error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-600 mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default Input;
