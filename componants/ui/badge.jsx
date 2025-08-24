import React from 'react';

const Badge = ({ 
  children, 
  variant = "default", 
  className = "", 
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200";
  
  const variantClasses = {
    default: "bg-gray-700 text-white shadow-md",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    secondary: "bg-indigo-600 text-white",
    accent: "bg-indigo-600 text-white shadow-md",
    "chart-2": "bg-amber-600 text-white shadow-md",
    "chart-4": "bg-gray-700 text-white shadow-md",
    "chart-5": "bg-orange-500 text-white shadow-md"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <span
      className={classes}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
