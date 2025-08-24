import React from 'react';

const Card = ({ className = "", children, ...props }) => {
  const baseClasses = "bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl overflow-hidden";
  const classes = `${baseClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ className = "", children, ...props }) => {
  const baseClasses = "p-8";
  const classes = `${baseClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ className = "", children, ...props }) => {
  const baseClasses = "pb-3";
  const classes = `${baseClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ className = "", children, ...props }) => {
  const baseClasses = "text-lg text-gray-700";
  const classes = `${baseClasses} ${className}`;

  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
};

export { Card, CardContent, CardHeader, CardTitle };
