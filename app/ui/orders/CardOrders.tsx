// components/CardOrders.tsx

import { fetchOrders, fetchUserById } from '@/app/lib/data';
import { Order } from '@/app/lib/definitions';

// Componente principal para mostrar todas las órdenes
export default async function CardOrders() {
  let orders: Order[] = [];

  try {
    orders = await fetchOrders();
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return <p>Error al cargar las órdenes.</p>;
  }

  // Obtener nombres de los usuarios
  const userPromises = orders.map(order => fetchUserById(order.user_id));
  const users = await Promise.all(userPromises);
  
  // Crear un mapa de IDs de usuario a nombres
  const userMap = users.reduce((acc, user) => {
    if (user) {
      acc[user.id] = user.name; // Asumiendo que el usuario tiene un campo `id` y `name`
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <div>
      <Card title="Órdenes" value={orders.length} type="orders" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Renderizamos todas las órdenes */}
        {orders.map((order: Order) => (
          <OrderCard key={order.id} order={order} userName={userMap[order.user_id]} />
        ))}
      </div>
    </div>
  );
}

// Componente para renderizar una orden individual
function OrderCard({ order, userName }: { order: Order; userName: string }) {
  return (
    <div className="rounded-xl bg-gray-100 p-4 shadow-md">
      <p className="text-sm font-semibold">Estado: {order.status}</p>
      <p className="text-sm text-gray-600">Fecha: {new Date(order.date).toLocaleDateString()}</p>
      <p className="text-sm text-gray-600">Mesa: {order.table_id}</p>
      <p className="text-sm text-gray-600">Usuario: {userName || 'Desconocido'}</p>
      <p className="text-sm text-gray-600">
        Productos: {order.product_ids.join(', ') || 'Sin productos'}
      </p>
    </div>
  );
}

// Card para mostrar el título y el conteo de órdenes
export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'Orders';
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
