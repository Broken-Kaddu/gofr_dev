import React from 'react';
import { CurrencyDollarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Balance {
  currency: string;
  amount: number;
}

const mockBalances: Balance[] = [
  { currency: 'USD', amount: 5000.00 },
  { currency: 'EUR', amount: 4200.00 },
  { currency: 'INR', amount: 6000.00 }
];

export const WalletOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Wallet Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockBalances.map((balance) => (
          <div key={balance.currency} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="font-medium">{balance.currency}</span>
              </div>
              <span className="text-lg font-bold">{balance.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <ArrowUpIcon className="h-4 w-4 mr-2" />
            Send Money
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            <ArrowDownIcon className="h-4 w-4 mr-2" />
            Receive Money
          </button>
        </div>
      </div>
    </div>
  );
};