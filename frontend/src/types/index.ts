export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  type: 'send' | 'receive';
  recipient: string;
}

export interface ExchangeRate {
  currency: string;
  rate: number;
}

export interface KYCData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  documentType: 'passport' | 'id' | 'license';
  documentNumber: string;
  verified: boolean;
}