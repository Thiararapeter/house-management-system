import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Edit, Trash, DollarSign } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  property: string;
}

const FinancialManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => axios.get('/api/transactions').then((res) => res.data),
  });

  const addTransactionMutation = useMutation({
    mutationFn: (newTransaction: Omit<Transaction, 'id'>) =>
      axios.post('/api/transactions', newTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsModalOpen(false);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: (updatedTransaction: Transaction) =>
      axios.put(`/api/transactions/${updatedTransaction.id}`, updatedTransaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsModalOpen(false);
      setEditingTransaction(null);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const transactionData = {
      date: formData.get('date') as string,
      type: formData.get('type') as 'income' | 'expense',
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      property: formData.get('property') as string,
    };

    if (editingTransaction) {
      updateTransactionMutation.mutate({ ...transactionData, id: editingTransaction.id });
    } else {
      addTransactionMutation.mutate(transactionData);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Financial Management</h1>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="inline-block mr-2" />
        Add Transaction
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Property</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transactions) && transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="py-2 px-4 border-b">{transaction.date}</td>
              <td className="py-2 px-4 border-b">
                <span className={`px-2 py-1 rounded ${transaction.type === 'income' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {transaction.type}
                </span>
              </td>
              <td className="py-2 px-4 border-b">${transaction.amount.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{transaction.description}</td>
              <td className="py-2 px-4 border-b">{transaction.property}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => {
                    setEditingTransaction(transaction);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit className="inline-block" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteTransactionMutation.mutate(transaction.id)}
                >
                  <Trash className="inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="date"
                name="date"
                defaultValue={editingTransaction?.date}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <select
                name="type"
                defaultValue={editingTransaction?.type}
                className="mb-2 w-full p-2 border rounded"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="number"
                name="amount"
                step="0.01"
                placeholder="Amount"
                defaultValue={editingTransaction?.amount}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                defaultValue={editingTransaction?.description}
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="property"
                placeholder="Property"
                defaultValue={editingTransaction?.property}
                className="mb-4 w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editingTransaction ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;