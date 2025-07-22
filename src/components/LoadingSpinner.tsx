import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-circle"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}; 