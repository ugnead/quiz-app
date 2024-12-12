import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  readOnly?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  containerClassName = "",
  className = "",
  id,
  readOnly = false,
  ...props
}) => {
  const textareaId =
    id || `textarea-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium mb-1 pointer-events-none"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        readOnly={readOnly}
        className={`block w-full border rounded-md px-3 py-2 cursor-pointer
          ${error ? "border-red-500" : "border-gray-300"}
          ${readOnly ? "bg-gray-200 text-gray-500 pointer-events-none" : "focus:outline-none focus:ring-2 focus:ring-blue-500"} ${className}`}
        {...props}
      />
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;
