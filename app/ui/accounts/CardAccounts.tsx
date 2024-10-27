// components/CardAccounts.tsx

import { fetchAccounts } from '@/app/lib/data';
import { Account } from '@/app/lib/definitions';

// Componente principal para mostrar todas las cuentas
export default async function CardAccounts() {
  let accounts: Account[] = [];

  try {
    accounts = await fetchAccounts();
  } catch (error) {
    console.error('Error al obtener las cuentas:', error);
    return <p>Error al cargar las cuentas.</p>;
  }

  return (
    <div>
      <Card title="Cuentas" value={accounts.length} type="accounts" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Renderizamos todas las cuentas */}
        {accounts.map((account: Account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}

// Componente para renderizar una cuenta individual
function AccountCard({ account }: { account: Account }) {
  return (
    <div className="rounded-xl bg-gray-100 p-4 shadow-md">
      <p className="text-sm font-semibold">Total: ${account.total.toFixed(2)}</p>
      <p className="text-sm text-gray-600">Estado: {account.status}</p>
      <p className="text-sm text-gray-600">Fecha: {new Date(account.date).toLocaleDateString()}</p>
    </div>
  );
}

// Card para mostrar el título y el conteo de cuentas
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'accounts';
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
        {value}
      </p>
    </div>
  );
}
