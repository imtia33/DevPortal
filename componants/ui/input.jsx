import React from 'react';

const Input = ({ 
  className = "", 
  type = "text",
  placeholder,
  value,
  onChange,
  ...props 
}) => {
  const baseClasses = "flex h-10 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-sans transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder:text-gray-500";
  
  const classes = `${baseClasses} ${className}`;

  return (
    <input
      type={type}
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export { Input };
