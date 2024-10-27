import React from 'react'
import { Metadata } from 'next';
import ProductsTable from '@/app/ui/products/ProductsTable';

export const metadata: Metadata = {
  title: 'Dashboard/Products',
};
function page() {
  return (
    <div>
      <ProductsTable/>
    </div>
  )
}

export default page
