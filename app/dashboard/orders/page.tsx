import React from 'react'
import { Metadata } from 'next';
import CardOrders from '@/app/ui/orders/CardOrders';

export const metadata: Metadata = {
  title: 'Dashboard/Orders',
};
function page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Órdenes
      </h1>
      <CardOrders />
    </div>
  )
}

export default page
