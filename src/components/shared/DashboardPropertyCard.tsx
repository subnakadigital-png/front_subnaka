'use client';
import React from 'react';
import Image from 'next/image';
import { Bed, Bath, Milestone, Edit, Trash2, CheckCircle, MapPin } from 'lucide-react';
import { Property } from '@/lib/types';
import Badge from '@/components/dashboard/shared/Badge';

interface DashboardPropertyCardProps {
  prop: Property;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
  onApprove: (propertyId: string) => void;
}

const DashboardPropertyCard: React.FC<DashboardPropertyCardProps> = ({ 
  prop, 
  onEdit, 
  onDelete, 
  onApprove 
}) => {
  const displayImage = prop.imageUrls?.[0] || prop.image || '/placeholder.png';

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden w-full transition-all duration-300 hover:shadow-md">
      <div className="h-48 bg-slate-200 relative">
        <Image 
          src={displayImage} 
          alt={prop.title} 
          fill 
          className="object-cover" 
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />
        <div className="absolute top-3 left-3"><Badge status={prop.status} /></div>
      </div>
      <div className="p-4 space-y-3">
        <div>
            <h3 className="font-bold text-lg text-slate-800 truncate">{prop.title}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><MapPin className="w-4 h-4" /> {prop.location}</p>
        </div>
        <div className="flex justify-between items-center text-slate-700">
          <span className="font-bold text-lg text-slate-800">₭{prop.price.toLocaleString()}</span>
          <div className="flex items-center text-sm gap-3 font-medium">
            <span className="flex items-center gap-1.5"><Bed className="w-5 h-5 text-slate-400"/> {prop.bedrooms || '-'}</span>
            <span className="flex items-center gap-1.5"><Bath className="w-5 h-5 text-slate-400"/> {prop.bathrooms || '-'}</span>
            <span className="flex items-center gap-1.5"><Milestone className="w-5 h-5 text-slate-400"/> {prop.area || '-'} m²</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <button onClick={() => onEdit(prop)} className="flex-1 py-2 px-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors"><Edit className="w-4 h-4" /> Edit</button>
          <button onClick={() => onDelete(prop)} className="flex-1 py-2 px-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
          {prop.status === 'Pending' && (
            <button onClick={() => onApprove(prop.id)} className="flex-1 py-2 px-3 text-sm font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center gap-2 transition-colors"><CheckCircle className="w-4 h-4" /> Approve</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPropertyCard;
