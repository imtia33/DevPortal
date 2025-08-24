import React from 'react';

const Textarea = ({ 
  className = "", 
  placeholder,
  value,
  onChange,
  rows = 4,
  ...props 
}) => {
  const baseClasses = "flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-sans transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder:text-gray-500 resize-none";
  
  const classes = `${baseClasses} ${className}`;

  return (
    <textarea
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      {...props}
    />
  );
};

export { Textarea };
