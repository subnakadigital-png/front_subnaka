import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ElementType;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-yellow-50 rounded-xl">
        <Icon className="w-6 h-6 text-yellow-600" />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
  </div>
);

export default StatCard;