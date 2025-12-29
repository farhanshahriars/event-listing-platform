import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export const Spinner = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`${sizeClass[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
  );
};

export default Loader;