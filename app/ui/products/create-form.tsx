'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createProduct, State } from '@/app/lib/products'; // Asegúrate de implementar `createProduct`
import { useActionState } from 'react';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createProduct, initialState);
  
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder="Enter product name"
          />
          {state.errors?.name && (
            <p className="mt-2 text-sm text-red-500">{state.errors.name.join(', ')}</p>
          )}
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            placeholder="Enter price"
          />
          {state.errors?.price && (
            <p className="mt-2 text-sm text-red-500">{state.errors.price.join(', ')}</p>
          )}
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}
