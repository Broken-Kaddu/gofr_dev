// blockchainService.ts

import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Go backend API URL

// Define the structure of a blockchain block
export interface Block {
  Index: number;
  UserID: string;
  Timestamp: string;
  TransactionID: number;
  TransactionStatus: string;
  Hash: string;
  PrevHash: string;
}

// Define the structure of a transaction message
export interface TransactionMessage {
  UserID: string;
  TransactionID: number;
  TransactionStatus: string;
}

// Service for interacting with the blockchain API
export const blockchainService = {
  /**
   * Fetches the entire blockchain from the backend.
   * @returns {Promise<Block[]>} - Array of blocks
   */
  getBlockchain: async (): Promise<Block[]> => {
    try {
      const response = await axios.get<Block[]>(`${API_URL}/blocks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blockchain:', error);
      throw new Error('Failed to fetch blockchain data.');
    }
  },

  /**
   * Adds a new block to the blockchain.
   * @param {TransactionMessage} transaction - The transaction data for the new block
   * @returns {Promise<Block>} - The newly added block
   */
  addBlock: async (transaction: TransactionMessage): Promise<Block> => {
    try {
      const response = await axios.post<Block>(`${API_URL}/blocks`, transaction);
      return response.data;
    } catch (error) {
      console.error('Error adding block:', error);
      throw new Error('Failed to add block.');
    }
  },

  /**
   * Retrieves the latest block from the blockchain.
   * @returns {Promise<Block>} - The latest block
   */
  getLatestBlock: async (): Promise<Block> => {
    try {
      const blockchain = await blockchainService.getBlockchain();
      if (blockchain.length === 0) {
        throw new Error('Blockchain is empty.');
      }
      return blockchain[blockchain.length - 1];
    } catch (error) {
      console.error('Error fetching the latest block:', error);
      throw new Error('Failed to fetch the latest block.');
    }
  },
};
