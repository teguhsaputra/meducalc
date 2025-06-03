import React from "react";

const LoadingSpinner = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center space-x-2 
        bg-neutral-300 rounded-md px-4 py-2 shadow-md"
      >
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600 text-xs">Loading</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
