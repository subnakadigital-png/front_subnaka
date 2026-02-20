'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-5 right-5 w-auto max-w-sm p-4 rounded-xl shadow-lg flex items-center text-white animate-fade-in-down
        ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
      <div className="flex-shrink-0">
        {isSuccess ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <XCircle className="w-6 h-6" />
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="ml-4 -mr-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-white">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
