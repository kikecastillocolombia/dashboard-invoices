'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createOrder } from '@/app/lib/orders';
import { useState } from 'react';
import { User, Table, Product } from '@/app/lib/definitions'; // Asegúrate de que estas definiciones existan

interface FormProps {
  users: User[];
  tables: Table[];
  products: Product[];
}

export default function Form({ users, tables, products }: FormProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, unknown>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const orderData = {
      user_id: selectedUser,
      table_id: selectedTable,
      product_ids: selectedProducts.map(id => ({ id, quantity: 1 })), // Se mantiene la cantidad en 1
      status: 'pending',
      date: new Date().toISOString(),
    };

    const response = await createOrder(orderData);

    if (response.errors) {
      setErrors(response.errors);
      setMessage(null);
    } else {
      setMessage(response.message);
      setErrors({});
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prevSelected) => 
      prevSelected.includes(productId) 
        ? prevSelected.filter(id => id !== productId) 
        : [...prevSelected, productId]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="text-green-600">{message}</div>}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-600">{JSON.stringify(errors)}</div>
      )}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Selection */}
        <div className="mb-4">
          <label htmlFor="user" className="mb-2 block text-sm font-medium">Select User</label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        {/* Table Selection */}
        <div className="mb-4">
          <label htmlFor="table" className="mb-2 block text-sm font-medium">Select Table</label>
          <select
            id="table"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
          >
            <option value="">Select a table</option>
            {tables.map(table => (
              <option key={table.id} value={table.id}>{table.number}</option>
            ))}
          </select>
        </div>

        {/* Products Selection */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Select Products</label>
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProductSelection(product.id)}
                className={`block rounded-md border py-2 px-4 text-sm transition-colors ${
                  selectedProducts.includes(product.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {product.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/orders" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
        <Button type="submit">Create Order</Button>
      </div>
    </form>
  );
}
