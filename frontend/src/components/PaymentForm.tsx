import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { blockchainService } from '../services/blockchain';
import toast from 'react-hot-toast';

interface PaymentFormData {
  amount: number;
  currency: string;
  recipient: string;
  description: string;
}

export const PaymentForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>();
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useAuthStore(state => state.user);

  const onSubmit = async (data: PaymentFormData) => {
    if (!user) {
      toast.error('Please log in to make a payment');
      return;
    }

    setIsProcessing(true);
    try {
      const transactionId = Math.floor(Math.random() * 1000000); // Generate random transaction ID
      
      // Add transaction to blockchain
      await blockchainService.addBlock({
        UserID: user.id,
        TransactionID: transactionId,
        TransactionStatus: 'pending'
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update transaction status
      await blockchainService.addBlock({
        UserID: user.id,
        TransactionID: transactionId,
        TransactionStatus: 'completed'
      });

      toast.success('Payment processed successfully!');
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
      
      // Add failed status to blockchain
      if (user) {
        try {
          await blockchainService.addBlock({
            UserID: user.id,
            TransactionID: Math.floor(Math.random() * 1000000),
            TransactionStatus: 'failed'
          });
        } catch (e) {
          console.error('Failed to record transaction failure:', e);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Make a Payment</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              {...register('amount', { required: true, min: 0 })}
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0.00"
            />
            {errors.amount && <span className="text-red-500 text-sm">Valid amount required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            {...register('currency', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="INR">INR</option>
          </select>
          {errors.currency && <span className="text-red-500 text-sm">Currency required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recipient</label>
          <input
            type="text"
            {...register('recipient', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.recipient && <span className="text-red-500 text-sm">Recipient required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isProcessing ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isProcessing ? 'Processing...' : 'Send Payment'}
        </button>
      </form>
    </div>
  );
};