// /app/ui/tables/CardTables.tsx
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardDataTable } from '@/app/lib/data';
import TableCard from './TableCard';

const iconMap = {
  tables: Squares2X2Icon,
};

// Definimos el tipo de mesa basado en la estructura de la tabla "tables"
type Table = {
  id: string;         
  number: number;     
  seats: number;      
  status: 'Disponible' | 'Ocupada' | 'Reservada'; 
};

export default async function CardTables() {
  const { totalTables, tables } = await fetchCardDataTable();

  return (
    <div>
      <Card title="Mesas" value={totalTables} type="tables" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Renderizamos todas las mesas */}
        {tables.map((table: Table) => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}

// Componente para mostrar el encabezado de la tarjeta
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "tables";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
