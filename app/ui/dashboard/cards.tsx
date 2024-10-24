import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
  ShoppingCartIcon,
  DocumentIcon,
  Squares2X2Icon
  
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

const iconMap = {
  collected: BanknotesIcon,
  users: UserGroupIcon,
  pending: ClockIcon,
  orders: InboxIcon,
  tables: Squares2X2Icon,       // Agrega el ícono para mesas
  products: ShoppingCartIcon,   // Agrega el ícono para productos
  accounts: DocumentIcon,   // Agrega el ícono para cuentas
};


export default async function CardWrapper() {
  const {
    numberOfOrders,
    numberOfUsers,
    totalPaidAccounts,
    totalPendingAccounts,
    totalTables,
    totalProducts,
    totalAccounts,
  } = await fetchCardData();

  return (
    <>
      <Card title="Cobrado" value={totalPaidAccounts} type="collected" />
      <Card title="Saldo por cobrar" value={totalPendingAccounts} type="pending" />
      <Card title="Ordenes" value={numberOfOrders} type="orders" />
      <Card title="Colaboradores" value={numberOfUsers} type="users" />
      <Card title="Mesas" value={totalTables} type="tables" />
      <Card title="Productos" value={totalProducts} type="products" />
      <Card title="Cuentas" value={totalAccounts} type="accounts" />
    </>
  );
}


export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'orders' | 'users' | 'pending' | 'collected' | "tables" | "products" | "accounts";
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
