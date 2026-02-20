import React, { useState } from 'react';
import CreateInvoice from './CreateInvoice'; // Import the new component

// Define a type for an Invoice
interface Invoice {
  id: string;
  client: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

// Dummy invoice data
const dummyInvoices: Invoice[] = [
  { id: 'INV001', client: 'John Doe', amount: '$1200.00', status: 'Paid' },
  { id: 'INV002', client: 'Jane Smith', amount: '$850.50', status: 'Pending' },
  { id: 'INV003', client: 'Acme Corp', amount: '$3500.00', status: 'Overdue' },
  { id: 'INV004', client: 'Bob Johnson', amount: '$600.00', status: 'Paid' },
];

const Invoices: React.FC = () => {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Helper function to determine badge styling based on status
  const getStatusBadgeClasses = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // If in creation mode, show the CreateInvoice component
  if (isCreatingInvoice) {
    return <CreateInvoice onBack={() => setIsCreatingInvoice(false)} />;
  }

  // Otherwise, show the list of invoices
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Invoices</h2>
          <p className="text-gray-600">Manage your property invoices.</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setIsCreatingInvoice(true)}
        >
          Create New Invoice
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(invoice.status)}`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">
                    View
                  </a>
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
