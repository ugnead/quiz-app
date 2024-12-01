import React from 'react';

interface LabelProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  text,
  variant = 'primary',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';

  const variantClasses = {
    primary: 'bg-blue-200 text-blue-800',
    secondary: 'bg-gray-200 text-gray-800',
    danger: 'bg-red-200 text-red-800',
    success: 'bg-green-200 text-green-800',
    warning: 'bg-yellow-200 text-yellow-800',
    info: 'bg-teal-200 text-teal-800',
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <span className={finalClassName}>{text}</span>;
};

export default Label;
