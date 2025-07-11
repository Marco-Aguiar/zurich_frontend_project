import React, { useState, useRef, useEffect } from 'react';
import { BookStatus } from '../types/Book';

interface StatusDropdownProps {
  currentStatus: BookStatus;
  allStatuses: BookStatus[];
  onStatusChange: (newStatus: BookStatus) => void;
  getStatusColor: (status: BookStatus) => string;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  allStatuses,
  onStatusChange,
  getStatusColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (status: BookStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center w-full px-3 py-1.5 rounded-full text-sm font-medium shadow-sm border border-gray-300 bg-white hover:bg-gray-50 transition-all ${getStatusColor(currentStatus)}`}
      >
        <span className="truncate w-full text-left">
          {currentStatus.replace(/_/g, ' ')}
        </span>
        <span className={`ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
          {allStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className={`group flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition-all relative`}
            >
              {/* Color bar indicator */}
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-r ${getStatusColor(status).split(' ')[0]}`}
              />
              <span className="pl-3 w-full text-left truncate">
                {status.replace(/_/g, ' ')}
              </span>
              {status === currentStatus && (
                <span className="ml-2 text-green-600 font-bold">✔</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
