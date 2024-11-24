import React from 'react';
import { WalletOverview } from './dashboard/WalletOverview';
import { CurrencyConverter } from './dashboard/CurrencyConverter';
import { BlockchainStatus } from './blockchain/BlockchainStatus';
import { Transaction } from '../types';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <WalletOverview />
      <CurrencyConverter />
      <BlockchainStatus />
    </div>
  );
};