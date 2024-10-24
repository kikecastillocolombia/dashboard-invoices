import { Squares2X2Icon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardDataTable } from '@/app/lib/data';

const iconMap = {
  tables: Squares2X2Icon,
};

// Definimos el tipo de mesa basado en la estructura de la tabla "tables"
type Table = {
  id: string;         // Identificador único para la mesa
  number: number;     // Número de la mesa (ejemplo: Mesa 1, Mesa 2)
  seats: number;      // Número de asientos en la mesa
  status: 'Disponible' | 'Ocupada' | 'Reservada'; // Estado actual de la mesa
};

export default async function CardTables() {
  const { totalTables, tables } = await fetchCardDataTable(); // Ajustar fetchCardDataTable para devolver `tables` también

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

// Componente para renderizar una mesa individual
function TableCard({ table }: { table: Table }) {
  return (
    <div className="rounded-xl bg-gray-100 p-4 shadow-md">
      <h3 className="text-lg font-semibold">Mesa {table.number}</h3>
      <p className="text-sm text-gray-600">Capacidad: {table.seats}</p>
      <p className="text-sm text-gray-600">Estado: {table.status}</p>
    </div>
  );
}

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
