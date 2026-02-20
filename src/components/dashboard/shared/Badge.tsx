import React from 'react';

interface BadgeProps {
  status: string;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const styles: { [key: string]: string } = {
    "New": "bg-blue-100 text-blue-700",
    "Active": "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    "Pending": "bg-orange-100 text-orange-700",
    "Closed": "bg-slate-100 text-slate-700",
    "Contacted": "bg-purple-100 text-purple-700",
    "Sale": "bg-slate-900 text-white",
    "Rent": "bg-slate-200 text-slate-900",
    "Inactive": "bg-red-100 text-red-700",
    "Open": "bg-red-100 text-red-700",
    "High": "bg-red-50 text-red-600 border border-red-200",
    "Medium": "bg-yellow-50 text-yellow-600 border border-yellow-200",
    "Low": "bg-green-50 text-green-600 border border-green-200",
    "Published": "bg-green-100 text-green-700",
    "Draft": "bg-slate-100 text-slate-700",
    "Scheduled": "bg-blue-100 text-blue-700",
    "Completed": "bg-slate-200 text-slate-700",
    "Viewing": "bg-purple-100 text-purple-700",
    "Meeting": "bg-blue-100 text-blue-700",
    "Contract": "bg-green-100 text-green-700",
    "Signed": "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

export default Badge;