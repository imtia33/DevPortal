import React from 'react';

const ScrollArea = ({ 
  className = "", 
  children,
  ...props 
}) => {
  const baseClasses = "overflow-auto";
  const classes = `${baseClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export { ScrollArea };
