import React from 'react';

interface SimRequestCardProps {
  date: string;
  status: string;
  oldNumber: string;
  newNumber: string;
  reason: string;
}

const SimRequestCard: React.FC<SimRequestCardProps> = ({
  date,
  status,
  oldNumber,
  newNumber,
  reason,
}) => {
  return (
    <div className="mb-4 p-3 border border-gray-200 rounded-xl">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{date}</span>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === 'Completed'
              ? 'bg-green-50 text-green-800'
              : 'bg-yellow-100 text-yellow-900'
          }`}
        >
          {status}
        </div>
      </div>
      <div className="h-px bg-gray-300 my-3"></div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">OLD SIM NUMBER</span>
        <span className="text-sm text-gray-600">NEW SIM NUMBER</span>
      </div>
      <div className="flex justify-between mt-1 mb-4">
        <span className="text-base text-gray-900">{oldNumber}</span>
        <span className="text-base text-gray-900">{newNumber}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-base text-gray-700">Reason</span>
        <span className="text-base font-medium text-gray-900">{reason}</span>
      </div>
    </div>
  );
};

export default SimRequestCard;