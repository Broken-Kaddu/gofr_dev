import React from 'react';
import { useForm } from 'react-hook-form';
import { KYCData } from '../types';

export const KYCForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<KYCData>();

  const onSubmit = (data: KYCData) => {
    console.log('KYC Data:', data);
    // Handle KYC submission
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              {...register('firstName', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.firstName && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              {...register('lastName', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.lastName && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              {...register('dateOfBirth', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.dateOfBirth && <span className="text-red-500 text-sm">Required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <select
              {...register('documentType', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="passport">Passport</option>
              <option value="id">ID Card</option>
              <option value="license">Driver's License</option>
            </select>
            {errors.documentType && <span className="text-red-500 text-sm">Required</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            {...register('address', { required: true })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.address && <span className="text-red-500 text-sm">Required</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Document Number</label>
          <input
            type="text"
            {...register('documentNumber', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.documentNumber && <span className="text-red-500 text-sm">Required</span>}
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit KYC
          </button>
        </div>
      </form>
    </div>
  );
};