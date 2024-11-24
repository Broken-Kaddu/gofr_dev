// BlockchainStatus.tsx
import React from 'react';
import useSWR from 'swr';
import type { Block } from '../../services/blockchain';
import { blockchainService } from '../../services/blockchain';

export const BlockchainStatus: React.FC = () => {
  const { data: blockchain, error } = useSWR<Block[]>('blockchain', blockchainService.getBlockchain, {
    refreshInterval: 5000, // Refresh every 5 seconds
  });

  if (error) return <div>Failed to load blockchain status</div>;
  if (!blockchain) return <div>Loading...</div>;

  // Safely access the latest block
  const latestBlock = blockchain[blockchain.length - 1] || null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Blockchain Status</h2>

      <div className="space-y-4">
        {/* Current Block Height and Latest Block Hash */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Current Block Height</p>
            <p className="text-lg font-bold">{blockchain.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Latest Block Hash</p>
            <p className="text-sm font-mono truncate">
              {latestBlock ? latestBlock.Hash : 'N/A'}
            </p>
          </div>
        </div>

        {/* Recent Blocks */}
        <div>
          <h3 className="text-lg font-medium mb-2">Recent Blocks</h3>
          <div className="space-y-2">
            {blockchain.slice(-5).reverse().map((block) => (
              <div key={block.Hash} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  {/* Block Details */}
                  <div>
                    <p className="font-medium">Block #{block.Index}</p>
                    <p className="text-sm text-gray-500">
                      {block.Timestamp
                        ? (() => {
                            // Extract the date and time portion and reformat it for ISO compatibility
                            const parsedTimestamp = block.Timestamp.split(" ")[0] + "T" + block.Timestamp.split(" ")[1];
                            const date = new Date(parsedTimestamp);

                            // Check if date is valid and return formatted result
                            return isNaN(date.getTime()) 
                              ? 'Invalid Timestamp' 
                              : date.toLocaleString(); // Localized date format
                          })()
                        : 'Invalid Timestamp'}
                    </p>
                  </div>

                  {/* Transaction Details */}
                  <div className="text-right">
                    <p className="text-sm">Transaction #{block.TransactionID}</p>
                    <p
                      className={`text-sm ${
                        block.TransactionStatus === 'completed'
                          ? 'text-green-500'
                          : block.TransactionStatus === 'pending'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {block.TransactionStatus || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
