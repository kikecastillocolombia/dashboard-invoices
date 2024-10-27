import React from 'react';
import CardTables from '@/app/ui/tables/CardTables'

const TablesPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Listado de Mesas</h1>
      <CardTables/>
    </div>
  );
};

export default TablesPage;
