import React from 'react';

const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  onClick, 
  disabled = false,
  type = "button",
  size = "default",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    default: "bg-gray-700 hover:bg-gray-600 text-white shadow-lg hover:shadow-xl",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
    secondary: "bg-indigo-600 hover:bg-indigo-500 text-white",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-600 hover:bg-red-500 text-white"
  };

  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
