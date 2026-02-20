'use client';

import React from 'react';
import AddPropertyView from '@/components/dashboard/views/AddProperty';

export default function AddPropertyPage() {
  // A dummy setActiveTab function for now
  const setActiveTab = (tab: string) => {
    console.log('Setting active tab to:', tab);
  };

  return <AddPropertyView setActiveTab={setActiveTab} />;
}
