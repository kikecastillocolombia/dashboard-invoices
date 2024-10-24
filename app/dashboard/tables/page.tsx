import React from 'react';
import { Table, TableStatus } from '@/app/lib/definitions'; // Asegúrate de importar ambos tipos
import TableChart from '@/app/ui/tables/TableChart';
import CardTables from '@/app/ui/tables/cardTables';

// Mock de datos de mesas

const mockTableData: Table[] = [
  { id: '1', number: 1, seats: 4, status: 'Disponible' },
  { id: '2', number: 2, seats: 2, status: 'Ocupada' },
  { id: '3', number: 3, seats: 6, status: 'Reservada' },
];

// Crear un arreglo de TableStatus a partir de mockTableData
const tableStatusData: TableStatus[] = [
  { label: 'Disponibles', count: mockTableData.filter(table => table.status === 'Disponible').length },
  { label: 'Ocupadas', count: mockTableData.filter(table => table.status === 'Ocupada').length },
  { label: 'Reservadas', count: mockTableData.filter(table => table.status === 'Reservada').length },
];

const TablesPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Listado de Mesas</h1>
      <TableChart tableStatusData={tableStatusData} /> {/* Utiliza tableStatusData aquí */}
      <CardTables/>
    </div>
  );
};

export default TablesPage;
