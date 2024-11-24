import React, { useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.45
};

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  const convertCurrency = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;
    
    const toUSD = numAmount / exchangeRates[fromCurrency as keyof typeof exchangeRates];
    return (toUSD * exchangeRates[toCurrency as keyof typeof exchangeRates]).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Currency Converter</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter amount"
          />
        </div>

        <div className="flex items-center justify-center">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          
          <ArrowsRightLeftIcon className="h-5 w-5 mx-4 text-gray-400" />
          
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Converted Amount</p>
          <p className="text-2xl font-bold text-indigo-600">
            {amount ? `${convertCurrency()} ${toCurrency}` : '-'}
          </p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Exchange rate: 1 {fromCurrency} = {(exchangeRates[toCurrency as keyof typeof exchangeRates] / exchangeRates[fromCurrency as keyof typeof exchangeRates]).toFixed(4)} {toCurrency}</p>
      </div>
    </div>
  );
};