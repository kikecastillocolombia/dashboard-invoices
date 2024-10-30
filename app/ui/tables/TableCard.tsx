'use client'; // Asegúrate de que este archivo esté marcado como cliente

import { useRouter } from 'next/navigation';
import React from 'react';

type Table = {
  id: string;         
  number: number;     
  seats: number;      
  status: 'Disponible' | 'Ocupada' | 'Reservada'; 
};

function TableCard({ table }: { table: Table }) {
  const router = useRouter();

  const handleCardClick = () => {
    if (table.status === 'Disponible') {
      router.push(`/orders/create`);
    }
  };

  return (
    <div 
      onClick={handleCardClick} 
      className={`rounded-xl p-4 shadow-md cursor-pointer ${table.status === 'Ocupada' ? 'bg-red-500' : 'bg-gray-100'}`}
    >
      <h3 className="text-lg font-semibold">Mesa {table.number}</h3>
      <p className="text-sm text-gray-600">Capacidad: {table.seats}</p>
      <p className="text-sm text-gray-600">Estado: {table.status}</p>
    </div>
  );
}

export default TableCard;
