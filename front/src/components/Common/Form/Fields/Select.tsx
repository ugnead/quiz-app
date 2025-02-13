import React from "react";
import { useField } from "formik";
import Input from "./Input";
import { v4 as uuidv4 } from "uuid";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  options: Option[];
  containerClassName?: string;
  readOnly?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps & { name: string }> = ({
  name,
  label,
  helperText,
  options,
  containerClassName = "",
  className = "",
  id,
  readOnly = false,
  placeholder,
  ...props
}) => {
  const [field, meta] = useField(name);
  const selectId = id || uuidv4();

  if (readOnly) {
    return (
      <Input name={name} label={label} placeholder={placeholder} readOnly />
    );
  }

  return (
    <div className={`mb-4 relative ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          {...field}
          id={selectId}
          className={`block w-full border rounded-md px-3 py-2 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
            ${meta.touched && meta.error ? "border-red-500" : "border-gray-300"} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={uuidv4()} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {helperText && !meta.error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-600 mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default Select;
